import { measure } from "../data/measure";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { services } from "../data/content";
import { enquiryTypes } from "../data/enquiry";
import { briefOptions, briefLabels } from "../data/brief";
import { useHydrated } from "../hooks/useHydrated";
import "./business.css";

export default function ServiceDiscovery() {
  const hydrated = useHydrated();
  const [choices, setChoices] = useState({
    profession: "",
    service: "",
    scope: "",
    engagement: "",
  });
  const [shown, setShown] = useState(false);
  const index = enquiryTypes.indexOf(
    choices.service as (typeof enquiryTypes)[number],
  );
  const service = services[index];
  const query = new URLSearchParams({ mode: "project", ...choices });
  return (
    <section
      className="container section-space service-discovery"
      id="service-finder"
      aria-labelledby="finder-title"
    >
      <div>
        <p className="eyebrow">A starting point, tailored to you</p>
        <h2 className="section-title" id="finder-title">
          Find the right
          <br />
          <em>kind of support.</em>
        </h2>
        <p className="body-copy">
          Four choices help us frame the conversation. The recommendation is a
          starting point; the scope and timing are agreed with you.
        </p>
      </div>
      <form
        className="discovery-form"
        onSubmit={(e) => {
          e.preventDefault();
          setShown(true);
          measure("discovery_complete");
        }}
      >
        {(["profession", "service", "scope", "engagement"] as const).map(
          (field, i) => (
            <label key={field} className="enquiry-field">
              <span>
                <span className="discovery-number">0{i + 1}</span>{" "}
                {field === "service" ? "What do you need?" : briefLabels[field]}
              </span>
              <select
                required
                disabled={!hydrated}
                value={choices[field]}
                onChange={(e) => {
                  setChoices({ ...choices, [field]: e.target.value });
                  setShown(false);
                }}
              >
                <option value="">Select an option</option>
                {(field === "service"
                  ? enquiryTypes.slice(0, 5)
                  : briefOptions[field]
                ).map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          ),
        )}
        <button className="button button-dark" disabled={!hydrated}>
          Find my starting point <ArrowUpRight size={17} aria-hidden="true" />
        </button>
        {shown && service && (
          <div className="discovery-result" role="status">
            <p className="eyebrow">Your suggested capability</p>
            <h3>{service.title}</h3>
            <p>
              {choices.profession} · {choices.scope}
            </p>
            <p>{service.description}</p>
            <p>
              {choices.engagement === "Recurring support"
                ? "For ongoing work, we can discuss a content rhythm, review responsibilities and a recurring scope."
                : "For a defined assignment, we begin by agreeing the question, deliverable and review process."}
            </p>
            <Link className="text-link" to={`/contact?${query}`}>
              Build your project brief <ArrowUpRight size={17} />
            </Link>
            <Link className="text-link" to={`/expertise/${service.slug}`}>
              Explore this capability <ArrowUpRight size={17} />
            </Link>
          </div>
        )}
      </form>
    </section>
  );
}
