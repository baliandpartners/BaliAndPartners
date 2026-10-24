import { useHydrated } from "../hooks/useHydrated";
import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import FounderVisual from "../components/FounderVisual";
import EditorialArt from "../components/EditorialArt";
import EditorialSpecimen from "../components/EditorialSpecimen";
import { ClosingNote } from "../components/SiteLayout";
import { articles, services } from "../data/content";
const process = [
  {
    name: "Discover",
    copy: "The audience. The context. The question worth asking.",
  },
  {
    name: "Research",
    copy: "Trace the sources. Check the authorities. Test the premise.",
  },
  {
    name: "Develop",
    copy: "Give the argument structure and the writing a distinct voice.",
  },
  {
    name: "Review",
    copy: "Check the claims. Incorporate your comments. Resolve the detail.",
  },
  {
    name: "Deliver",
    copy: "Your approved work, prepared in the agreed format for its intended reader.",
  },
];
export default function Home() {
  const hydrated = useHydrated();
  const [activeService, setActiveService] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  return (
    <>
      <section className="home-hero" id="hero">
        <div className="container">
          <div className="hero-meta">
            <p className="eyebrow">
              <span className="tiny-square" /> Legal content & strategy
              consultancy
            </p>
            <span className="hero-location">
              Based in New Delhi · Thinking beyond borders
            </span>
          </div>
          <div className="hero-composition">
            <div className="hero-copy">
              <h1>
                Legal substance.
                <br />
                <em>Editorial precision.</em>
              </h1>
              <p>
                Research-led legal writing, editorial and knowledge support for
                law firms, chambers and professional teams.
              </p>
              <div className="hero-actions">
                <Link to="/expertise" className="button button-dark">
                  Explore our expertise <ArrowUpRight size={19} />
                </Link>
                <Link to="/approach" className="text-link">
                  Our approach <ArrowRight size={17} />
                </Link>
              </div>
            </div>
            <EditorialArt />
          </div>
          <div className="hero-bottom">
            <a className="scroll-cue" href="#perspective">
              <span className="scroll-circle">
                <ArrowDown size={17} />
              </span>{" "}
              A little more perspective
            </a>
            <span className="hero-disciplines">
              Research <span>·</span> Editorial <span>·</span> Strategy
            </span>
            <span className="hero-edition">01 — 06</span>
          </div>
        </div>
      </section>
      <section id="perspective" className="perspective-section section-space">
        <div className="container perspective-grid">
          <div className="section-marker">
            <span className="eyebrow">01 / Our perspective</span>
            <span className="perspective-symbol" aria-hidden="true">
              &
            </span>
          </div>
          <div>
            <h2 className="section-title">
              The difference is
              <br />
              in the <em>understanding.</em>
            </h2>
            <div className="perspective-copy">
              <p>
                Good legal communication starts long before the first sentence.
                It starts with the right questions, a careful reading of the
                source, and a clear sense of who needs to understand it.
              </p>
              <p>
                Bali & Partners provides dedicated research and editorial
                capacity for professionals whose expertise deserves time and
                care on the page. We develop source material into structured
                drafts, with clear review points and your final approval.
              </p>
            </div>
            <Link className="text-link" to="/about">
              Get to know us <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="expertise-section section-space" id="services">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / Our expertise</p>
              <h2 className="section-title">
                Substance.
                <br />
                <em>In every sense.</em>
              </h2>
            </div>
            <p className="section-intro">
              Distinct disciplines.
              <br />
              One considered approach to
              <br />
              legal communication.
            </p>
          </div>
          <div className="expertise-composition">
            <div className="capability-aside">
              <div className="capability-visual" aria-hidden="true">
                <span className="capability-big-number">
                  0{activeService + 1}
                </span>
                <div className={`capability-lines variation-${activeService}`}>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <span className="capability-caption">
                  THE DISCIPLINE OF CLARITY
                </span>
              </div>
              <p key={activeService}>{services[activeService]?.description}</p>
              <Link to="/expertise" className="text-link">
                View all capabilities <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="capability-index">
              {services.map((service, i) => (
                <Link
                  key={service.slug}
                  to={`/expertise/${service.slug}`}
                  className={`capability-row${activeService === i ? " is-active" : ""}`}
                  onMouseEnter={() => setActiveService(i)}
                  onFocus={() => setActiveService(i)}
                >
                  <span className="capability-number">0{i + 1}</span>
                  <div>
                    <h3>{service.shortTitle || service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <ArrowUpRight className="capability-arrow" size={23} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="specimen-section section-space" id="clarity">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / The editorial lens</p>
              <h2 className="section-title">
                From complexity
                <br />
                to <em>clarity.</em>
              </h2>
            </div>
            <p className="section-intro">
              An idea, examined. An argument, shaped.
              <br />
              Explore what considered editing changes—
              <br />
              and what it carefully preserves.
            </p>
          </div>
          <EditorialSpecimen />
        </div>
      </section>
      <section className="method-section section-space" id="method">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / The method</p>
              <h2 className="section-title">
                Considered at
                <br />
                <em>every step.</em>
              </h2>
            </div>
            <Link to="/approach" className="text-link">
              Inside our approach <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="method-timeline" aria-label="Our working process">
            {process.map((step, i) => (
              <button
                key={step.name}
                type="button"
                disabled={!hydrated}
                className={`method-step${activeStep === i ? " is-active" : ""}`}
                aria-expanded={activeStep === i}
                aria-controls={`method-description-${i}`}
                onClick={() => setActiveStep(i)}
              >
                <span className="method-number">
                  0{i + 1}
                  <Plus size={16} />
                </span>
                <h3>{step.name}</h3>
                <span
                  id={`method-description-${i}`}
                  className="method-copy"
                  hidden={activeStep !== i}
                >
                  {step.copy}
                </span>
              </button>
            ))}
          </div>
          <p className="method-note">
            A shared understanding of scope. A careful attention to detail.
          </p>
        </div>
      </section>
      <section className="insights-home section-space">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">05 / Selected perspectives</p>
              <h2 className="section-title">
                A space for
                <br />
                <em>considered thought.</em>
              </h2>
            </div>
            <Link to="/insights" className="text-link">
              Explore the reading room <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="home-articles">
            {articles.slice(0, 3).map((article, i) => (
              <Link
                className={`home-article article-${i}`}
                to={`/insights/${article.slug}`}
                key={article.slug}
              >
                <div className="article-art" aria-hidden="true">
                  <span className="article-art-letter">
                    {["Aa", "“", "¶"][i]}
                  </span>
                  <span className="article-art-line" />
                  <span className="article-art-number">0{i + 1}</span>
                </div>
                <div className="article-meta">
                  <span>{article.category}</span>
                  <span>{article.label}</span>
                </div>
                <h3>{article.title}</h3>
                <span className="article-read">
                  Read perspective <ArrowUpRight size={17} />
                </span>
              </Link>
            ))}
          </div>
          <p className="editorial-disclosure">
            Entries marked “Editorial sample” demonstrate writing and
            communication practice. They are not legal analysis or advice.
          </p>
        </div>
      </section>
      <section className="founder-home section-space" id="about">
        <div className="container founder-grid">
          <FounderVisual>
            <div className="founder-type-art" aria-hidden="true">
              <span className="founder-initials">
                SB<span>.</span>
              </span>
              <div className="founder-art-footer">
                <span>
                  THE PERSON
                  <br />
                  BEHIND THE PERSPECTIVE
                </span>
                <span>
                  NEW DELHI
                  <br />
                  INDIA
                </span>
              </div>
            </div>
          </FounderVisual>
          <div className="founder-copy">
            <p className="eyebrow">06 / A personal perspective</p>
            <h2 className="section-title">
              Founded on
              <br />
              <em>thoughtful work.</em>
            </h2>
            <p>
              Shashwat Bali founded Bali & Partners around a simple idea: legal
              knowledge deserves careful expression.
            </p>
            <p>
              A specialist consultancy at the intersection of research, writing
              and professional communication.
            </p>
            <div className="founder-signature">
              <strong>Shashwat Bali</strong>
              <span>Founder, Bali & Partners</span>
            </div>
            <Link className="text-link" to="/about">
              The thinking behind the work <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <div id="contact">
        <ClosingNote />
      </div>
    </>
  );
}
