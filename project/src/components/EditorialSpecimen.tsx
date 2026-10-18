import { useId, useRef, useState, type KeyboardEvent } from "react";
import "./interactive.css";

const stages = [
  {
    name: "Source",
    caption: "Understand the material",
    heading: "The clause, as received.",
    annotation: "First, preserve the substance.",
    detail:
      "Before editing, identify the right, the conditions and the limits. A smoother sentence must not change an obligation.",
    note: "One sentence. Several distinct requirements.",
  },
  {
    name: "Structure",
    caption: "Find the hierarchy",
    heading: "Give each condition its place.",
    annotation: "Make the logic visible.",
    detail:
      "Separate the action from its conditions. This makes the sequence easier to follow and the important qualifications harder to miss.",
    note: "The meaning stays intact. The hierarchy emerges.",
  },
  {
    name: "Clarity",
    caption: "Write for the reader",
    heading: "A clear path through the detail.",
    annotation: "Clarity is a matter of judgment.",
    detail:
      "Use direct language, purposeful structure and enough context. Preserve the exception as carefully as the main point.",
    note: "The same conditions. A more considered expression.",
  },
];

export default function EditorialSpecimen() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % stages.length;
    else if (event.key === "ArrowLeft")
      next = (index + stages.length - 1) % stages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="editorial-specimen">
      <div
        className="specimen-tabs"
        role="tablist"
        aria-label="Editorial specimen stages"
      >
        {stages.map((stage, index) => (
          <button
            key={stage.name}
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            onClick={() => setActive(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="specimen-tab"
          >
            <span className="specimen-tab-number" aria-hidden="true">
              0{index + 1}
            </span>
            <span className="specimen-tab-name">{stage.name}</span>
            <span className="specimen-tab-caption">{stage.caption}</span>
          </button>
        ))}
      </div>

      {stages.map((stage, index) => (
        <div
          key={stage.name}
          id={`${id}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${index}`}
          tabIndex={0}
          hidden={active !== index}
          className={`specimen-panel specimen-panel-${stage.name.toLowerCase()}`}
        >
          <div className="specimen-document">
            <div className="specimen-document-topline">
              <span>Editorial study / 001</span>
              <span>Lease renewal</span>
            </div>
            <h3>{stage.heading}</h3>

            {index === 0 && (
              <div className="specimen-source-copy">
                <span className="specimen-clause-label">
                  Fictional clause · renewal option
                </span>
                <p>
                  The tenant may exercise an option to renew the lease for a
                  further term of twelve months by giving{" "}
                  <span className="specimen-underline">written notice</span> to
                  the landlord{" "}
                  <span className="specimen-underline">
                    at least sixty days before the expiry
                  </span>{" "}
                  of the current term, such notice to be sent to the postal
                  address stated in the lease; any communication sent by
                  electronic mail shall not constitute notice for the purposes
                  of this clause.
                </p>
                <div className="specimen-margin-note">
                  <span aria-hidden="true">↳</span> Right · duration · timing ·
                  form · exception
                </div>
              </div>
            )}

            {index === 1 && (
              <dl className="specimen-outline">
                <div>
                  <dt>
                    <span>01</span> The option
                  </dt>
                  <dd>The tenant may renew for 12 months.</dd>
                </div>
                <div>
                  <dt>
                    <span>02</span> The deadline
                  </dt>
                  <dd>
                    Give notice at least 60 days before the current term ends.
                  </dd>
                </div>
                <div>
                  <dt>
                    <span>03</span> The form
                  </dt>
                  <dd>
                    Written notice, sent to the postal address in the lease.
                  </dd>
                </div>
                <div>
                  <dt>
                    <span>04</span> The limit
                  </dt>
                  <dd>Email does not constitute notice under this clause.</dd>
                </div>
              </dl>
            )}

            {index === 2 && (
              <div className="specimen-clear-copy">
                <span className="specimen-clause-label">
                  A reader-focused explanation
                </span>
                <p className="specimen-clear-lead">
                  The lease allows the tenant to renew for another 12 months.
                </p>
                <p>To exercise that option:</p>
                <ol>
                  <li>
                    Give the landlord written notice{" "}
                    <strong>
                      at least 60 days before the current term ends.
                    </strong>
                  </li>
                  <li>
                    Send the notice to the postal address stated in the lease.
                  </li>
                </ol>
                <p className="specimen-qualification">
                  <span aria-hidden="true">↳</span> Email does not count as
                  notice under this clause.
                </p>
              </div>
            )}

            <div className="specimen-document-bottomline">
              <span>{stage.note}</span>
              <span aria-hidden="true">0{index + 1} / 03</span>
            </div>
          </div>

          <aside
            className="specimen-annotation"
            aria-label="Editorial reasoning"
          >
            <span className="specimen-annotation-label">
              The editorial decision
            </span>
            <span className="specimen-annotation-mark" aria-hidden="true">
              {index === 0 ? "¶" : index === 1 ? "§" : "Aa"}
            </span>
            <h4>{stage.annotation}</h4>
            <p>{stage.detail}</p>
            {index < stages.length - 1 ? (
              <button
                type="button"
                className="specimen-next"
                onClick={() => {
                  setActive(index + 1);
                  tabs.current[index + 1]?.focus();
                }}
              >
                Explore {stages[index + 1].name.toLowerCase()}{" "}
                <span aria-hidden="true">↗</span>
              </button>
            ) : (
              <button
                type="button"
                className="specimen-next"
                onClick={() => {
                  setActive(0);
                  tabs.current[0]?.focus();
                }}
              >
                Revisit the source <span aria-hidden="true">↶</span>
              </button>
            )}
          </aside>
        </div>
      ))}

      <p className="specimen-disclaimer">
        A fictional editorial demonstration, not client work or legal advice.
        Actual notice requirements depend on the complete agreement and
        applicable law.
      </p>
    </div>
  );
}
