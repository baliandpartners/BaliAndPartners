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
type PreparedDraft = { subject: string; body: string; href: string };
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
  const [draft, setDraft] = useState<PreparedDraft | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">(
    "idle",
  );
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLTextAreaElement>(null);

  function updateValue(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const field = event.target.name as keyof FormValues;
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    setDraft(null);
    setCopyState("idle");
    if (attempted) setErrors(validate(next));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstField = Object.keys(nextErrors)[0];
      (
        formRef.current?.elements.namedItem(firstField) as HTMLElement | null
      )?.focus();
      return;
    }

    const subject = `Website enquiry: ${values.nature}`;
    const body = [
      "Hello Bali & Partners,",
      "",
      values.message.trim(),
      "",
      `Name: ${values.name.trim()}`,
      ...(values.organisation.trim()
        ? [`Organisation: ${values.organisation.trim()}`]
        : []),
      `Email: ${values.email.trim()}`,
      `Nature of enquiry: ${values.nature}`,
    ].join("\n");
    setDraft({
      subject,
      body,
      href: `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    });
    setCopyState("idle");
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  async function copyDraft() {
    if (!draft) return;
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard is unavailable");
      await navigator.clipboard.writeText(
        `To: ${contactEmail}\nSubject: ${draft.subject}\n\n${draft.body}`,
      );
      setCopyState("copied");
    } catch {
      setCopyState("fallback");
      requestAnimationFrame(() => {
        copyRef.current?.focus();
        copyRef.current?.select();
      });
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
        <h2>Prepare an email enquiry.</h2>
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
          This form prepares a draft on your device. Nothing is sent or saved by
          the form. You review and send it using your email app.
        </p>
        {attempted && Object.keys(errors).length > 0 && (
          <p className="enquiry-error-summary" role="alert">
            Please check the highlighted fields before preparing your email.
          </p>
        )}
        <button type="submit" className="enquiry-submit" disabled={!hydrated}>
          Prepare email <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </form>

      {draft && (
        <div
          className="enquiry-draft"
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby={`${id}-draft-title`}
        >
          <span className="enquiry-draft-eyebrow">Ready for your review</span>
          <h3 id={`${id}-draft-title`}>Your draft is prepared.</h3>
          <p>
            Open it in your email app, review the details, then send it to{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. No message
            has been sent yet.
          </p>
          <div className="enquiry-draft-actions">
            <a href={draft.href} className="enquiry-open-email">
              Open email draft <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <button type="button" onClick={copyDraft} className="enquiry-copy">
              {copyState === "copied" ? "Draft copied" : "Copy draft"}
            </button>
          </div>
          <p className="enquiry-copy-status" role="status" aria-live="polite">
            {copyState === "copied" &&
              "Copied. You can paste the draft into your preferred email service."}
            {copyState === "fallback" &&
              "Automatic copying is unavailable. Select and copy the draft below."}
          </p>
          {copyState === "fallback" && (
            <div className="enquiry-field enquiry-copy-fallback">
              <label htmlFor={`${id}-copy`}>Email draft to copy</label>
              <textarea
                ref={copyRef}
                id={`${id}-copy`}
                readOnly
                rows={10}
                value={`To: ${contactEmail}\nSubject: ${draft.subject}\n\n${draft.body}`}
                onFocus={(event) => event.currentTarget.select()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
