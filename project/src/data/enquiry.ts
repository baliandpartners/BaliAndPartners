export const enquiryTypes = [
  "Legal research & analysis",
  "Legal content & editorial",
  "Thought leadership",
  "Content strategy",
  "Professional communications",
  "A broader conversation",
] as const;

export const callbackWindows = [
  "Any working-hour time",
  "Morning · 9 am–12 pm IST",
  "Afternoon · 12–5 pm IST",
] as const;

export type EnquiryValues = {
  name: string;
  organisation: string;
  email: string;
  phone: string;
  contactPreference: "email" | "callback";
  callbackWindow: string;
  nature: string;
  message: string;
  consent: boolean;
};
export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>;
export const emptyEnquiry: EnquiryValues = {
  name: "",
  organisation: "",
  email: "",
  phone: "",
  contactPreference: "email",
  callbackWindow: callbackWindows[0],
  nature: "",
  message: "",
  consent: false,
};

/** Shared limits; the server always validates independently of the browser. */
export function validateEnquiry(input: unknown): {
  values: EnquiryValues;
  errors: EnquiryErrors;
} {
  const data =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const string = (key: string) =>
    typeof data[key] === "string" ? data[key].trim() : "";
  const values: EnquiryValues = {
    name: string("name"),
    organisation: string("organisation"),
    email: string("email").toLowerCase(),
    phone: string("phone"),
    contactPreference:
      data.contactPreference as EnquiryValues["contactPreference"],
    callbackWindow: string("callbackWindow"),
    nature: string("nature"),
    message: string("message"),
    consent: data.consent === true,
  };
  const errors: EnquiryErrors = {};
  if (!values.name || values.name.length > 100)
    errors.name = "Enter your name (up to 100 characters).";
  if (values.organisation.length > 120)
    errors.organisation = "Use up to 120 characters.";
  if (!["email", "callback"].includes(values.contactPreference))
    errors.contactPreference = "Choose how we should respond.";
  if (
    (!values.email && values.contactPreference === "email") ||
    (values.email &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ||
        values.email.length > 254))
  ) {
    errors.email = "Enter a valid email address.";
  }
  if (values.contactPreference === "callback") {
    const digits = values.phone.replace(/\D/g, "");
    if (
      !/^[+\d\s().-]+$/.test(values.phone) ||
      digits.length < 7 ||
      digits.length > 15 ||
      values.phone.length > 32
    )
      errors.phone = "Enter a telephone number with country code.";
    if (!(callbackWindows as readonly string[]).includes(values.callbackWindow))
      errors.callbackWindow = "Choose a preferred callback time.";
  } else {
    values.phone = "";
    values.callbackWindow = "";
  }
  if (!(enquiryTypes as readonly string[]).includes(values.nature))
    errors.nature = "Choose the nature of your enquiry.";
  if (!values.message || values.message.length > 1500)
    errors.message = "Add a brief outline (up to 1500 characters).";
  if (!values.consent)
    errors.consent = "Please confirm we may use these details to respond.";
  for (const [key, value] of Object.entries(values)) {
    if (
      typeof value === "string" &&
      Array.from(value).some((character) => {
        const code = character.charCodeAt(0);
        return (code < 32 && ![9, 10, 13].includes(code)) || code === 127;
      })
    )
      errors[key as keyof EnquiryValues] =
        "Remove unsupported control characters.";
  }
  return { values, errors };
}
