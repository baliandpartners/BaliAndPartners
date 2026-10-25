import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useHydrated } from "../hooks/useHydrated";
import {
  callbackWindows,
  emptyEnquiry,
  enquiryTypes,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryValues,
} from "../data/enquiry";
import "./interactive.css";

const contactEmail = "Shashwat@baliandpartners.in";
const referencePattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function ContactForm() {
  const hydrated = useHydrated();
  const id = useId();
  const [values, setValues] = useState<EnquiryValues>(emptyEnquiry);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [availability, setAvailability] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState("");
  const [receipt, setReceipt] = useState<{
    reference: string;
    callback: boolean;
  }>();
  const [website, setWebsite] = useState("");
  const challenge = useRef("");
  const pending = useRef(false);
  const request = useRef<{ content: string; id: string }>();
  const formRef = useRef<HTMLFormElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  async function prepare(signal?: AbortSignal) {
    setAvailability("loading");
    try {
      const response = await fetch("/api/enquiries", {
        signal: signal
          ? AbortSignal.any([signal, AbortSignal.timeout(15000)])
          : AbortSignal.timeout(15000),
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok || typeof result.challenge !== "string")
        throw new Error("Unavailable");
      challenge.current = result.challenge;
      setAvailability("ready");
    } catch {
      if (!signal?.aborted) setAvailability("unavailable");
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    void prepare(controller.signal);
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (receipt) receiptRef.current?.focus();
  }, [receipt]);

  function updateValue(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const field = event.target.name as keyof EnquiryValues;
    const value =
      field === "consent"
        ? (event.target as HTMLInputElement).checked
        : event.target.value;
    const next = { ...values, [field]: value };
    setValues(next);
    setFailure("");
    if (attempted) setErrors(validateEnquiry(next).errors);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || availability !== "ready") return;
    setAttempted(true);
    const validation = validateEnquiry(values);
    setErrors(validation.errors);
    if (Object.keys(validation.errors).length) {
      const field = Object.keys(validation.errors)[0];
      (
        formRef.current?.elements.namedItem(field) as HTMLElement | null
      )?.focus();
      return;
    }
    const content = JSON.stringify(validation.values);
    if (request.current?.content !== content)
      request.current = { content, id: crypto.randomUUID() };
    pending.current = true;
    setSending(true);
    setFailure("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validation.values,
          requestId: request.current!.id,
          challenge: challenge.current,
          website,
        }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.error === "challenge_expired") {
          await prepare();
          setFailure(
            "Your form session was refreshed. Please submit again; your details are still here.",
          );
        } else if (result.error === "please_wait") {
          setFailure("Please wait a moment, then try again.");
        } else if (result.error === "rate_limited") {
          setFailure(
            "We have received several requests recently. Please try again in an hour, or contact us using the details below.",
          );
        } else if (result.error === "request_conflict") {
          request.current = undefined;
          setFailure(
            "This reference was already used for different details. Please submit again for a new reference.",
          );
        } else throw new Error("Unconfirmed");
        return;
      }
      if (
        result.received !== true ||
        !referencePattern.test(result.reference) ||
        result.reference !== request.current!.id
      )
        throw new Error("Unconfirmed");
      setReceipt({
        reference: result.reference,
        callback: validation.values.contactPreference === "callback",
      });
      setValues(emptyEnquiry);
      setErrors({});
      setAttempted(false);
      request.current = undefined;
    } catch {
      setFailure(
        "We could not confirm receipt. Your details are still here. You can retry safely, or contact us directly below.",
      );
    } finally {
      pending.current = false;
      setSending(false);
    }
  }

  const fieldError = (field: keyof EnquiryValues) =>
    errors[field] ? (
      <span id={`${id}-${field}-error`} className="enquiry-error">
        {errors[field]}
      </span>
    ) : null;
  const described = (field: keyof EnquiryValues) =>
    errors[field] ? `${id}-${field}-error` : undefined;
  const disabled = !hydrated || sending || availability !== "ready";

  return (
    <div className="enquiry-composer">
      <div className="enquiry-introduction">
        <h2>Start a conversation.</h2>
        <p>
          Send an enquiry or request a callback. A brief outline helps us
          understand the work and respond thoughtfully.
        </p>
      </div>
      {receipt ? (
        <div
          className="enquiry-receipt"
          ref={receiptRef}
          tabIndex={-1}
          role="status"
        >
          <Check size={26} aria-hidden="true" />
          <h3>
            {receipt.callback
              ? "Your callback request is received."
              : "Your enquiry is received."}
          </h3>
          <p>
            Your request has been recorded. We will review it and respond using
            the details you provided. Preferred callback times are requests, not
            confirmed appointments.
          </p>
          <p className="enquiry-reference">
            Reference <span>{receipt.reference}</span>
          </p>
          <button
            className="text-link"
            type="button"
            onClick={() => {
              setReceipt(undefined);
              void prepare();
            }}
          >
            Send another enquiry <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          {availability === "loading" && (
            <p className="enquiry-availability" role="status">
              Preparing the secure enquiry form…
            </p>
          )}
          {availability === "unavailable" && (
            <div className="enquiry-error-summary" role="alert">
              <p>
                Online enquiries are temporarily unavailable. Please call{" "}
                <a href="tel:+918269026882">+91 82690 26882</a> or email{" "}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
              </p>
              <button
                type="button"
                className="text-link"
                onClick={() => void prepare()}
              >
                Try again
              </button>
            </div>
          )}
          <form
            ref={formRef}
            className="enquiry-form"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={sending}
          >
            <fieldset className="enquiry-fields" disabled={disabled}>
              <legend className="sr-only">Enquiry details</legend>
              <fieldset className="enquiry-preference">
                <legend>How should we respond?</legend>
                <label>
                  <input
                    type="radio"
                    name="contactPreference"
                    value="email"
                    checked={values.contactPreference === "email"}
                    onChange={updateValue}
                  />{" "}
                  By email
                </label>
                <label>
                  <input
                    type="radio"
                    name="contactPreference"
                    value="callback"
                    checked={values.contactPreference === "callback"}
                    onChange={updateValue}
                  />{" "}
                  Request a callback
                </label>
              </fieldset>
              <div className="enquiry-field-pair">
                <div className="enquiry-field">
                  <label htmlFor={`${id}-name`}>
                    Your name{" "}
                    <span className="enquiry-required">(required)</span>
                  </label>
                  <input
                    id={`${id}-name`}
                    name="name"
                    value={values.name}
                    onChange={updateValue}
                    autoComplete="name"
                    maxLength={100}
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={described("name")}
                  />
                  {fieldError("name")}
                </div>
                <div className="enquiry-field">
                  <label htmlFor={`${id}-organisation`}>
                    Organisation <span>(optional)</span>
                  </label>
                  <input
                    id={`${id}-organisation`}
                    name="organisation"
                    value={values.organisation}
                    onChange={updateValue}
                    autoComplete="organization"
                    maxLength={120}
                    aria-invalid={!!errors.organisation}
                    aria-describedby={described("organisation")}
                  />
                  {fieldError("organisation")}
                </div>
              </div>
              <div className="enquiry-field">
                <label htmlFor={`${id}-email`}>
                  Email address{" "}
                  <span
                    className={
                      values.contactPreference === "email"
                        ? "enquiry-required"
                        : ""
                    }
                  >
                    (
                    {values.contactPreference === "email"
                      ? "required"
                      : "optional"}
                    )
                  </span>
                </label>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  inputMode="email"
                  value={values.email}
                  onChange={updateValue}
                  autoComplete="email"
                  maxLength={254}
                  required={values.contactPreference === "email"}
                  aria-invalid={!!errors.email}
                  aria-describedby={described("email")}
                />
                {fieldError("email")}
              </div>
              {values.contactPreference === "callback" && (
                <div className="enquiry-field-pair">
                  <div className="enquiry-field">
                    <label htmlFor={`${id}-phone`}>
                      Telephone number{" "}
                      <span className="enquiry-required">(required)</span>
                    </label>
                    <input
                      id={`${id}-phone`}
                      name="phone"
                      type="tel"
                      value={values.phone}
                      onChange={updateValue}
                      autoComplete="tel"
                      placeholder="Include country code"
                      maxLength={32}
                      required
                      aria-invalid={!!errors.phone}
                      aria-describedby={described("phone")}
                    />
                    {fieldError("phone")}
                  </div>
                  <div className="enquiry-field">
                    <label htmlFor={`${id}-callbackWindow`}>
                      Preferred callback time
                    </label>
                    <select
                      id={`${id}-callbackWindow`}
                      name="callbackWindow"
                      value={values.callbackWindow}
                      onChange={updateValue}
                      aria-invalid={!!errors.callbackWindow}
                      aria-describedby={described("callbackWindow")}
                    >
                      {callbackWindows.map((window) => (
                        <option key={window}>{window}</option>
                      ))}
                    </select>
                    {fieldError("callbackWindow")}
                  </div>
                </div>
              )}
              <div className="enquiry-field">
                <label htmlFor={`${id}-nature`}>
                  Nature of enquiry{" "}
                  <span className="enquiry-required">(required)</span>
                </label>
                <select
                  id={`${id}-nature`}
                  name="nature"
                  value={values.nature}
                  onChange={updateValue}
                  required
                  aria-invalid={!!errors.nature}
                  aria-describedby={described("nature")}
                >
                  <option value="">Select an area of interest</option>
                  {enquiryTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                {fieldError("nature")}
              </div>
              <div className="enquiry-field">
                <label htmlFor={`${id}-message`}>
                  A brief outline{" "}
                  <span className="enquiry-required">(required)</span>
                </label>
                <textarea
                  id={`${id}-message`}
                  name="message"
                  value={values.message}
                  onChange={updateValue}
                  rows={5}
                  maxLength={1500}
                  required
                  aria-invalid={!!errors.message}
                  aria-describedby={`${id}-message-help${errors.message ? ` ${id}-message-error` : ""}`}
                />
                <div className="enquiry-field-caption">
                  <span id={`${id}-message-help`}>
                    Please leave out confidential or sensitive information.
                  </span>
                  <span
                    className="enquiry-character-count"
                    aria-label={`${values.message.length} of 1500 characters`}
                  >
                    {values.message.length}/1500
                  </span>
                </div>
                {fieldError("message")}
              </div>
              <div className="enquiry-trap" aria-hidden="true">
                <label htmlFor={`${id}-website`}>Leave this field empty</label>
                <input
                  id={`${id}-website`}
                  name="website"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="enquiry-consent">
                <label>
                  <input
                    type="checkbox"
                    name="consent"
                    checked={values.consent}
                    onChange={updateValue}
                    required
                    aria-invalid={!!errors.consent}
                    aria-describedby={described("consent")}
                  />
                  <span>
                    I agree that Bali &amp; Partners may store these details and
                    contact me about this request.
                  </span>
                </label>
                {fieldError("consent")}
              </div>
              <p className="enquiry-privacy-note">
                Your request is stored privately for review and follow-up. Read
                our <Link to="/privacy">privacy notice</Link>. A callback
                request does not confirm an appointment.
              </p>
              {attempted && Object.keys(errors).length > 0 && (
                <p className="enquiry-error-summary" role="alert">
                  Please check the highlighted fields before submitting.
                </p>
              )}
              <button
                type="submit"
                className="enquiry-submit"
                disabled={disabled}
              >
                {sending
                  ? "Submitting…"
                  : values.contactPreference === "callback"
                    ? "Request a callback"
                    : "Send enquiry"}
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </fieldset>
          </form>
          {failure && (
            <div className="enquiry-error-summary" role="alert">
              <p>{failure}</p>
              <p>
                <a href="tel:+918269026882">+91 82690 26882</a> ·{" "}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
