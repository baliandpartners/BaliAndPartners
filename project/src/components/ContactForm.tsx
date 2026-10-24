import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ArrowUpRight } from "lucide-react";
import "./interactive.css";
import { useHydrated } from "../hooks/useHydrated";

const contactEmail = "Shashwat@baliandpartners.in";
const enquiryTypes = [
  "Legal research & analysis",
  "Legal content & editorial",
  "Thought leadership",
  "Content strategy",
  "Professional communications",
  "A broader conversation",
];

type FormValues = {
  name: string;
  organisation: string;
  email: string;
  nature: string;
  message: string;
};
type FormErrors = Partial<Record<keyof FormValues, string>>;

const emptyForm: FormValues = {
  name: "",
  organisation: "",
  email: "",
  nature: "",
  message: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!enquiryTypes.includes(values.nature))
    errors.nature = "Please choose the nature of your enquiry.";
  if (!values.message.trim())
    errors.message = "Please add a brief outline of your enquiry.";
  return errors;
}

export default function ContactForm() {
  const hydrated = useHydrated();
  const id = useId();
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  function updateValue(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const field = event.target.name as keyof FormValues;
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    setStatus("idle");
    if (attempted) setErrors(validate(next));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setAttempted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstField = Object.keys(nextErrors)[0];
      (formRef.current?.elements.namedItem(firstField) as HTMLElement | null)?.focus();
      return;
    }
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch(`${url.replace(/\\/$/, "")}/rest/v1/contact_submissions`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: values.name.trim(),
          organisation: values.organisation.trim() || null,
          email: values.email.trim(),
          nature: values.nature,
          message: values.message.trim(),
        }),
      });
      if (!response.ok) throw new Error("Unable to submit enquiry");
      setStatus("sent");
      setValues(emptyForm);
      setAttempted(false);
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  function fieldError(field: keyof FormValues) {
    return errors[field] ? (
      <span id={`${id}-${field}-error`} className="enquiry-error">
        {errors[field]}
      </span>
    ) : null;
  }

  return (
    <div className="enquiry-composer">
      <div className="enquiry-introduction">
        <h2>Send an enquiry.</h2>
        <p>
          A little context is a useful starting point. Outline the work, your
          audience and any relevant timing.
        </p>
      </div>
      <form
        ref={formRef}
        className="enquiry-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="enquiry-field-pair">
          <div className="enquiry-field">
            <label htmlFor={`${id}-name`}>
              Your name <span className="enquiry-required">(required)</span>
            </label>
            <input
              id={`${id}-name`}
              disabled={!hydrated}
              name="name"
              value={values.name}
              onChange={updateValue}
              autoComplete="name"
              maxLength={100}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${id}-name-error` : undefined}
            />
            {fieldError("name")}
          </div>
          <div className="enquiry-field">
            <label htmlFor={`${id}-organisation`}>
              Organisation <span>(optional)</span>
            </label>
            <input
              id={`${id}-organisation`}
              disabled={!hydrated}
              name="organisation"
              value={values.organisation}
              onChange={updateValue}
              autoComplete="organization"
              maxLength={120}
            />
          </div>
        </div>
        <div className="enquiry-field">
          <label htmlFor={`${id}-email`}>
            Email address <span className="enquiry-required">(required)</span>
          </label>
          <input
            id={`${id}-email`}
            disabled={!hydrated}
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={updateValue}
            autoComplete="email"
            maxLength={254}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
          />
          {fieldError("email")}
        </div>
        <div className="enquiry-field">
          <label htmlFor={`${id}-nature`}>
            Nature of enquiry{" "}
            <span className="enquiry-required">(required)</span>
          </label>
          <select
            id={`${id}-nature`}
            disabled={!hydrated}
            name="nature"
            value={values.nature}
            onChange={updateValue}
            required
            aria-invalid={!!errors.nature}
            aria-describedby={errors.nature ? `${id}-nature-error` : undefined}
          >
            <option value="">Select an area of interest</option>
            {enquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {fieldError("nature")}
        </div>
        <div className="enquiry-field">
          <label htmlFor={`${id}-message`}>
            A brief outline <span className="enquiry-required">(required)</span>
          </label>
          <textarea
            id={`${id}-message`}
            disabled={!hydrated}
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
        <p className="enquiry-privacy-note">
          Your enquiry will be stored securely for the purpose of reviewing and responding to your request. Please do not share confidential or sensitive case information.
        </p>
        {attempted && Object.keys(errors).length > 0 && (
          <p className="enquiry-error-summary" role="alert">
            Please check the highlighted fields before preparing your email.
          </p>
        )}
        <button type="submit" className="enquiry-submit" disabled={!hydrated || status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry"} <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </form>

      {status === "sent" && (
        <div className="enquiry-draft" role="status" aria-live="polite">
          <h3>Your enquiry has been received.</h3>
          <p>Thank you for writing to Bali &amp; Partners. Your message has been recorded.</p>
        </div>
      )}
      {status === "error" && (
        <p className="enquiry-error-summary" role="alert">
          We could not securely submit your enquiry. Nothing has been confirmed as saved.
          Please email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> instead.
        </p>
      )}
    </div>
  );
}
