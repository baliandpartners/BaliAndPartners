import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import FounderVisual from "../components/FounderVisual";
import ContactForm from "../components/ContactForm";
import { useHydrated } from "../hooks/useHydrated";
import { articles, services, readingTime, type Article } from "../data/content";
import "./pages.css";

const process = [
  {
    title: "Discover",
    description: "Begin with the right questions.",
    text: "We discuss the audience, intended use, subject, voice and scope. The aim is a brief that makes the assignment clear before the work begins.",
    details: [
      "Audience and objective",
      "Scope and source material",
      "Format, timing and review responsibilities",
    ],
  },
  {
    title: "Research",
    description: "Establish the substance.",
    text: "We examine relevant primary authorities and supporting material around the agreed question, keeping citations, qualifications and outstanding issues visible.",
    details: [
      "Source review and research direction",
      "Key distinctions and qualifications",
      "A working structure for the argument",
    ],
  },
  {
    title: "Develop",
    description: "Give the thinking a form.",
    text: "Research becomes a structured draft. We focus on the argument, sequence and voice, with the level of detail the intended reader needs.",
    details: [
      "Outline and narrative structure",
      "Draft development",
      "Voice and audience alignment",
    ],
  },
  {
    title: "Review",
    description: "Refine with care.",
    text: "We bring editorial review together with your subject-matter input. Claims, nuance and expression are examined before the work moves towards final approval.",
    details: [
      "Substantive and editorial feedback",
      "Accuracy and qualification checks",
      "Revisions against the agreed brief",
    ],
  },
  {
    title: "Deliver",
    description: "Prepare for its purpose.",
    text: "After client comments and the agreed revisions, the approved work is prepared for its intended format. Authorship, intellectual-property rights and permitted reuse follow the assignment agreement.",
    details: [
      "Final editorial preparation",
      "Agreed format and handover",
      "Next steps for recurring assignments",
    ],
  },
];

function PageCta({
  title = "A considered conversation is a good place to begin.",
}: {
  title?: string;
}) {
  return (
    <section className="page-cta section-space">
      <div className="container page-cta-inner">
        <span className="eyebrow">Begin a conversation</span>
        <h2>{title}</h2>
        <Link className="button button-dark" to="/contact">
          Discuss an assignment <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function Breadcrumb({
  label,
  to,
  current,
}: {
  label: string;
  to: string;
  current: string;
}) {
  return (
    <nav className="page-breadcrumb" aria-label="Breadcrumb">
      <Link to={to}>{label}</Link>
      <span aria-hidden="true">/</span>
      <span>{current}</span>
    </nav>
  );
}

export function ExpertisePage() {
  return (
    <>
      <section className="interior-hero container">
        <p className="eyebrow">Our expertise</p>
        <div className="interior-hero-split">
          <h1 className="display">
            Substance.
            <br />
            Structure.
            <br />
            <em>Expression.</em>
          </h1>
          <div className="hero-note">
            <span className="editorial-cross" aria-hidden="true">
              +
            </span>
            <p className="body-copy">
              Five connected capabilities. One considered approach to legal
              knowledge and professional communication.
            </p>
            <a href="#capabilities" className="text-link">
              Explore the capabilities{" "}
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <section
        className="expertise-index container"
        id="capabilities"
        aria-label="Our capabilities"
      >
        {services.map((service) => (
          <Link
            className="expertise-entry"
            key={service.slug}
            to={`/expertise/${service.slug}`}
          >
            <span className="index-number">{service.number}</span>
            <div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </div>
            <ArrowUpRight
              className="entry-arrow"
              size={30}
              strokeWidth={1.3}
              aria-hidden="true"
            />
          </Link>
        ))}
      </section>
      <section className="scope-section section-space">
        <div className="container scope-layout">
          <p className="eyebrow">A connected perspective</p>
          <div>
            <h2 className="section-title">
              The work changes.
              <br />
              The care behind it does not.
            </h2>
            <p className="body-copy">
              A research note, a published article and a professional profile
              serve different purposes. Each asks for the same discipline:
              understand the subject, respect the context and make every word
              useful.
            </p>
            <Link className="text-link" to="/approach">
              How we approach the work{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <PageCta />
    </>
  );
}

export function ServicePage() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);
  if (!service) return <NotFoundPage />;
  const next = services[(services.indexOf(service) + 1) % services.length];
  return (
    <>
      <section className="interior-hero container service-hero">
        <Breadcrumb
          label="Expertise"
          to="/expertise"
          current={service.shortTitle}
        />
        <div className="service-heading">
          <div>
            <p className="eyebrow">Capability / {service.number}</p>
            <h1 className="display">{service.title}</h1>
            <p className="body-copy">{service.description}</p>
          </div>
          <div className="service-mark" aria-hidden="true">
            <span>{service.number}</span>
            <i />
            <small>Substance into expression</small>
          </div>
        </div>
      </section>
      <section className="service-introduction container section-space">
        <p className="eyebrow">The scope</p>
        <div>
          <h2 className="service-intro-copy">{service.intro}</h2>
          <p className="service-audience">{service.audience}</p>
        </div>
      </section>
      <section className="service-deliverables section-space">
        <div className="container service-detail-grid">
          <div>
            <p className="eyebrow">How we can support you</p>
            <h2 className="section-title">
              Work shaped
              <br />
              around the brief.
            </h2>
            <p className="body-copy">
              The scope, format and review process are agreed for each
              assignment.
            </p>
          </div>
          <ul className="deliverables-list">
            {service.deliverables.map((item, index) => (
              <li key={item}>
                <span>0{index + 1}</span>
                <h3>{item}</h3>
                <Plus size={18} strokeWidth={1} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="container section-space service-principles">
        <p className="eyebrow">What guides the work</p>
        <div className="principles-grid">
          {service.principles.map((principle, index) => (
            <div key={principle.title}>
              <span className="principle-number">0{index + 1} /</span>
              <h2>{principle.title}</h2>
              <p>{principle.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container service-commissioning section-space">
        <div>
          <p className="eyebrow">A useful starting point</p>
          <h2 className="section-title">
            An assignment,
            <br />
            <em>clearly defined.</em>
          </h2>
          <p className="body-copy">{service.firstAssignment}</p>
        </div>
        <div className="commissioning-details">
          <h3>How the work proceeds</h3>
          <p>{service.workflow}</p>
          <h3>Your role in the review</h3>
          <p>{service.clientResponsibility}</p>
        </div>
      </section>
      <PageCta title={service.question} />
      <div className="container next-capability">
        <span className="eyebrow">Next capability</span>
        <Link to={`/expertise/${next.slug}`}>
          {next.title}
          <ArrowRight aria-hidden="true" size={24} />
        </Link>
      </div>
    </>
  );
}

export function ApproachPage() {
  const hydrated = useHydrated();
  const [active, setActive] = useState(0);
  return (
    <>
      <section className="interior-hero container approach-hero">
        <p className="eyebrow">Our approach</p>
        <h1 className="display">
          Careful thinking.
          <br />
          <em>Clear expression.</em>
        </h1>
        <div className="approach-intro">
          <span className="short-rule" aria-hidden="true" />
          <p className="body-copy">
            Good work is a sequence of considered decisions. We bring research,
            writing and editorial judgment into one coherent process.
          </p>
        </div>
      </section>
      <section
        className="method-section section-space"
        aria-labelledby="method-title"
      >
        <div className="container">
          <div className="method-heading">
            <p className="eyebrow">From brief to final draft</p>
            <h2 className="section-title" id="method-title">
              A method, with purpose.
            </h2>
          </div>
          <div className="method-layout">
            <div className="method-steps" aria-label="Explore our process">
              {process.map((step, index) => (
                <button
                  disabled={!hydrated}
                  key={step.title}
                  type="button"
                  aria-pressed={active === index}
                  aria-controls="method-detail"
                  className={
                    active === index ? "method-step is-active" : "method-step"
                  }
                  onClick={() => setActive(index)}
                >
                  <span>0{index + 1}</span>
                  <strong>{step.title}</strong>
                  <ArrowUpRight size={22} aria-hidden="true" />
                </button>
              ))}
            </div>
            <div
              className="method-detail"
              id="method-detail"
              aria-live="polite"
            >
              <span className="method-large-number" aria-hidden="true">
                0{active + 1}
              </span>
              <h3>{process[active].description}</h3>
              <p>{process[active].text}</p>
              <ul>
                {process[active].details.map((detail) => (
                  <li key={detail}>
                    <Check size={15} aria-hidden="true" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="container section-space engagement-section">
        <div>
          <p className="eyebrow">Ways of working</p>
          <h2 className="section-title">
            The right format
            <br />
            for the assignment.
          </h2>
        </div>
        <div className="engagement-options">
          <article>
            <span className="eyebrow">01 / Project-based</span>
            <h3>A defined piece of work.</h3>
            <p>
              A research assignment, an article, a manuscript or a content
              review. We agree the brief, deliverables and review stages around
              a specific outcome.
            </p>
          </article>
          <article>
            <span className="eyebrow">02 / Recurring editorial support</span>
            <h3>A continuing conversation.</h3>
            <p>
              For a sustained publishing programme or professional voice,
              recurring assignments create room for continuity, planning and a
              shared editorial understanding.
            </p>
          </article>
        </div>
      </section>
      <section className="container approach-faq">
        <div>
          <p className="eyebrow">Before we begin</p>
          <h2 className="section-title">A few useful details.</h2>
        </div>
        <div>
          {[
            [
              "What should an initial brief include?",
              "A short description of the subject, audience, intended format and timeline is enough to begin. Please avoid sending confidential documents or sensitive personal information with an initial enquiry.",
            ],
            [
              "How is the scope agreed?",
              "The scope, responsibilities, deliverables, timing and commercial terms are discussed before an assignment begins. An enquiry does not by itself create an engagement.",
            ],
            [
              "Who approves the final content?",
              "The author or commissioning organisation retains final approval. Subject-matter review and any required professional or legal approvals should be agreed as part of the engagement.",
            ],
            [
              "How are confidentiality and ownership handled?",
              "Confidentiality, access to source material, authorship, intellectual-property rights and permitted reuse should be settled in the assignment agreement before sensitive material is shared. Initial enquiries should contain only a general outline.",
            ],
            [
              "What happens after the first draft?",
              "The commissioning team provides consolidated comments and any required subject-matter review. Revisions, review responsibilities and the final approval process are agreed in the scope; they are not an unlimited revision commitment.",
            ],
            [
              "Do you provide legal representation?",
              "This website describes legal research, content, editorial and communications services. It does not offer litigation representation or personalised legal advice.",
            ],
          ].map(([question, answer]) => (
            <details className="editorial-disclosure" key={question}>
              <summary>
                {question}
                <Plus size={18} aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <PageCta />
    </>
  );
}

function ArticleVisual({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  return (
    <div
      className={`article-visual article-visual-${index % 3} ${className}`}
      aria-hidden="true"
    >
      <div className="article-visual-lines" />
      <span className="article-visual-glyph">
        {["Aa", "“", "§"][index % 3]}
      </span>
      <span className="article-visual-caption">
        B&amp;P / Editorial perspectives
      </span>
    </div>
  );
}

function ArticleEntry({ article, index }: { article: Article; index: number }) {
  return (
    <article className="insight-entry">
      <Link
        className="insight-artwork-link"
        to={`/insights/${article.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ArticleVisual index={index} />
      </Link>
      <div className="insight-entry-copy">
        <div className="article-meta">
          <span>{article.category}</span>
          <span>{readingTime(article)}</span>
        </div>
        <Link to={`/insights/${article.slug}`} className="insight-title-link">
          <h2>{article.title}</h2>
          <ArrowUpRight size={24} strokeWidth={1.4} aria-hidden="true" />
        </Link>
        <p>{article.excerpt}</p>
        <span className="sample-label">{article.label}</span>
      </div>
    </article>
  );
}

export function InsightsPage() {
  const hydrated = useHydrated();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All perspectives";
  const query = searchParams.get("q") || "";
  const updateFilter = (key: string, value: string) => {
    // Navigation updates the URL before React commits the next render. Read it
    // here so a rapid second input preserves the first filter change.
    const next = new URLSearchParams(window.location.search);
    if (value && value !== "All perspectives") next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };
  const categories = [
    "All perspectives",
    ...new Set(articles.map((article) => article.category)),
  ];
  const filtered = articles.filter(
    (article) =>
      (category === "All perspectives" || category === article.category) &&
      `${article.title} ${article.excerpt} ${article.category}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <section className="interior-hero container insights-hero">
        <p className="eyebrow">The editorial perspective</p>
        <div className="interior-hero-split">
          <h1 className="display">
            Ideas, given
            <br />
            <em>consideration.</em>
          </h1>
          <p className="body-copy">
            Notes on legal writing, professional thought and the craft of making
            knowledge useful.
          </p>
        </div>
      </section>
      <section
        className="container insights-content"
        aria-labelledby="perspectives-title"
      >
        <div className="sample-notice">
          <span className="sample-notice-mark" aria-hidden="true">
            i
          </span>
          <p>
            Entries marked “Editorial sample” demonstrate writing and
            communication practice. Any approved legal publications identify
            their author, date, scope and sources separately.
          </p>
        </div>
        <h2 id="perspectives-title" className="sr-only">
          Browse perspectives
        </h2>
        <div className="insights-toolbar">
          <div
            className="category-filters"
            aria-label="Filter perspectives by category"
          >
            {categories.map((item) => (
              <button
                key={item}
                disabled={!hydrated}
                type="button"
                className={category === item ? "is-active" : ""}
                onClick={() => updateFilter("category", item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="insights-search">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search perspectives</span>
            <input
              disabled={!hydrated}
              value={query}
              onChange={(event) => updateFilter("q", event.target.value)}
              type="search"
              placeholder="Search perspectives"
            />
          </label>
        </div>
        <p className="results-status" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length === 1 ? "perspective" : "perspectives"}
        </p>
        <div className="insight-list">
          {filtered.map((article) => (
            <ArticleEntry
              key={article.slug}
              article={article}
              index={articles.indexOf(article)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="insights-empty">
              <h3>No perspectives found.</h3>
              <p>Try another phrase or return to the full collection.</p>
              <button
                className="text-link"
                type="button"
                onClick={() => {
                  setSearchParams({}, { replace: true });
                }}
              >
                View all perspectives{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </section>
      <PageCta title="Have an idea that deserves careful development?" />
    </>
  );
}

export function ArticlePage() {
  const hydrated = useHydrated();
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);
  const [copyStatus, setCopyStatus] = useState("");
  const [copyFallback, setCopyFallback] = useState(false);
  const copyInput = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setCopyStatus("");
    setCopyFallback(false);
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!bodyRef.current) return;
      const rect = bodyRef.current.getBoundingClientRect();
      setProgress(
        Math.min(
          100,
          Math.max(
            0,
            ((window.innerHeight * 0.3 - rect.top) / rect.height) * 100,
          ),
        ),
      );
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slug]);
  if (!article) return <NotFoundPage />;
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://www.baliandpartners.in/insights/${article.slug}`,
      );
      setCopyFallback(false);
      setCopyStatus("Link copied.");
    } catch {
      setCopyStatus(
        "Automatic copying is unavailable. Select and copy the link below.",
      );
      setCopyFallback(true);
      requestAnimationFrame(() => {
        copyInput.current?.focus();
        copyInput.current?.select();
      });
    }
  };
  return (
    <>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <section className="container article-heading">
        <Breadcrumb
          label="Perspectives"
          to="/insights"
          current={article.category}
        />
        <div className="article-meta">
          <span>{article.category}</span>
          <span>{readingTime(article)}</span>
          <span className="sample-label">{article.label}</span>
        </div>
        <h1>{article.title}</h1>
        <p className="article-standfirst">{article.standfirst}</p>
        {article.kind === "publication" && (
          <p className="publication-byline">
            By {article.author.name}
            {article.author.role ? ` · ${article.author.role}` : ""}
            <br />
            Published{" "}
            <time dateTime={article.publishedAt}>{article.publishedAt}</time>
            {article.reviewedAt && (
              <>
                {" "}
                · Substantive review{" "}
                <time dateTime={article.reviewedAt}>{article.reviewedAt}</time>
              </>
            )}
            {" · "}
            {article.jurisdiction}
          </p>
        )}
      </section>
      <div className="container article-layout">
        <aside className="article-sidebar">
          <p className="eyebrow">In this perspective</p>
          <nav aria-label="Article sections">
            {article.sections.map((section, index) => (
              <a key={section.id} href={`#${section.id}`}>
                <span>0{index + 1}</span>
                {section.title}
              </a>
            ))}
          </nav>
          <button
            className="text-link article-copy"
            type="button"
            disabled={!hydrated}
            onClick={copyLink}
          >
            {copyStatus === "Link copied." ? (
              <Check size={15} aria-hidden="true" />
            ) : (
              <Copy size={15} aria-hidden="true" />
            )}
            Copy article link
          </button>
          <p className="copy-status" role="status">
            {copyStatus}
          </p>
          {copyFallback && (
            <label className="article-copy-fallback">
              Article link to copy
              <input
                ref={copyInput}
                readOnly
                value={`https://www.baliandpartners.in/insights/${article.slug}`}
                onFocus={(event) => event.currentTarget.select()}
              />
            </label>
          )}
        </aside>
        <div className="article-body" ref={bodyRef}>
          <p className="article-sample-note">
            {article.kind === "sample" ? (
              <>
                <strong>Editorial sample.</strong> This piece demonstrates
                editorial practice. It is not client work, legal advice or a
                report on a legal development.
              </>
            ) : (
              article.disclaimer
            )}
          </p>
          {article.kind === "publication" && (
            <p className="publication-qualifications">
              {article.qualifications}
            </p>
          )}
          {article.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {article.kind === "publication" && section.sourceIds?.length ? (
                <p className="section-sources">
                  Sources:{" "}
                  {section.sourceIds.map((id, index) => (
                    <span key={id}>
                      {index ? "; " : ""}
                      <a href={`#source-${id}`}>
                        {
                          article.sources.find((source) => source.id === id)
                            ?.citation
                        }
                      </a>
                    </span>
                  ))}
                </p>
              ) : null}
            </section>
          ))}
          {article.kind === "publication" && (
            <section
              className="publication-sources"
              aria-labelledby="sources-title"
            >
              <h2 id="sources-title">Sources and authorities</h2>
              <ol>
                {article.sources.map((source) => (
                  <li id={`source-${source.id}`} key={source.id}>
                    <a href={source.url}>{source.title}</a>
                    <p>{source.citation}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
          <div className="article-end-mark" aria-hidden="true">
            B<span>&amp;</span>P
          </div>
          <Link className="text-link" to="/insights">
            <ArrowLeft size={16} aria-hidden="true" />
            All perspectives
          </Link>
        </div>
      </div>
      <section className="container section-space related-reading">
        <div className="related-heading">
          <p className="eyebrow">Continue reading</p>
          <h2 className="section-title">Another perspective.</h2>
        </div>
        {articles
          .filter(
            (item) =>
              item.slug !== slug &&
              (!article.relatedSlugs?.length ||
                article.relatedSlugs.includes(item.slug)),
          )
          .map((item) => (
            <Link key={item.slug} to={`/insights/${item.slug}`}>
              <div>
                <span className="eyebrow">
                  {item.category} · {item.label}
                </span>
                <h3>{item.title}</h3>
              </div>
              <ArrowUpRight size={25} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          ))}
      </section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <section className="container interior-hero about-hero">
        <p className="eyebrow">About Bali &amp; Partners</p>
        <h1 className="display">
          An editorial mind.
          <br />
          <em>A legal perspective.</em>
        </h1>
        <div className="about-intro">
          <FounderVisual>
            <div className="about-lettermark" aria-hidden="true">
              B<span>&amp;</span>P
            </div>
          </FounderVisual>
          <div>
            <p className="about-lead">
              Bali &amp; Partners is a specialist legal content, research and
              strategy consultancy based in New Delhi.
            </p>
            <p className="body-copy">
              Our work sits where legal understanding meets written expression.
              We support law firms, chambers, legal publishers and in-house
              teams with focused research, substantive drafting and editorial
              review. The aim is useful written work that makes time for the
              detail while respecting the commissioning professional’s judgment.
            </p>
          </div>
        </div>
      </section>
      <section className="founder-profile section-space">
        <div className="container founder-layout">
          <div>
            <p className="eyebrow">The founder</p>
            <h2 className="section-title">Shashwat Bali</h2>
            <span className="founder-location">
              Advocate &amp; Founder · New Delhi, India
            </span>
          </div>
          <div className="founder-copy">
            <h3>
              A perspective shaped
              <br />
              by legal practice.
            </h3>
            <p>
              Shashwat Bali is an advocate and the founder of Bali &amp;
              Partners. His academic background includes legal studies at
              Symbiosis Law School, Noida, and academic experience at Leeds
              Beckett University, United Kingdom.
            </p>
            <p>
              His professional experience has been shaped by working with a
              distinguished Senior Advocate, independent Advocates-on-Record,
              full-service law firms and boutique legal practices, including a
              Legal 500-recognised firm.
            </p>
            <p>
              Over the past three years, he has undertaken legal research,
              drafting and analytical assignments through individual projects
              and sustained professional associations with firms and chambers.
              His exposure encompasses commercial disputes, arbitration,
              regulatory work and complex legal documentation.
            </p>
            <p>
              Bali &amp; Partners draws on that practical foundation to deliver
              research-led legal content, editorial development and professional
              communication with precision, discretion and attention to detail.
            </p>
            <Link to="/approach" className="text-link">
              The approach behind the work{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="container section-space about-principles">
        <div>
          <p className="eyebrow">The principles</p>
          <h2 className="section-title">Measured in the work.</h2>
        </div>
        <div className="principle-rows">
          {[
            [
              "Substance",
              "Begin with understanding.",
              "The quality of the expression depends on the quality of the thinking beneath it.",
            ],
            [
              "Precision",
              "Make the distinction matter.",
              "Careful language preserves nuance. It does not smooth away the parts that need attention.",
            ],
            [
              "Clarity",
              "Respect the reader’s time.",
              "Structure and language should help the reader understand the subject without unnecessary effort.",
            ],
            [
              "Discretion",
              "Work with professional care.",
              "Agree the scope, review process and handling of material before an assignment begins.",
            ],
          ].map(([label, title, text], index) => (
            <article key={label}>
              <span className="index-number">
                0{index + 1} / {label}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <PageCta title="Good work begins with a shared understanding." />
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <section className="container interior-hero contact-hero">
        <p className="eyebrow">Contact</p>
        <h1 className="display">
          Let’s start with
          <br />
          <em>the substance.</em>
        </h1>
        <p className="body-copy">
          Tell us what you are working on, who it is for and where a considered
          editorial perspective could help.
        </p>
      </section>
      <section className="container contact-layout">
        <aside className="contact-details">
          <p className="eyebrow">A direct conversation</p>
          <a
            className="contact-method"
            href="mailto:Shashwat@baliandpartners.in"
          >
            <Mail size={18} strokeWidth={1.4} aria-hidden="true" />
            <span>
              <small>Email</small>Shashwat@baliandpartners.in
            </span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a className="contact-method" href="tel:+918269026882">
            <Phone size={18} strokeWidth={1.4} aria-hidden="true" />
            <span>
              <small>Telephone</small>+91 82690 26882
            </span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <div className="contact-method">
            <MapPin size={18} strokeWidth={1.4} aria-hidden="true" />
            <span>
              <small>Based in</small>New Delhi, India
            </span>
          </div>
          <div className="contact-note">
            <span className="short-rule" aria-hidden="true" />
            <h2>A little context is enough.</h2>
            <p>
              Please share a general outline at this stage. Do not include
              confidential documents, case records or sensitive personal
              information.
            </p>
            <p>
              An enquiry does not create a professional engagement or an
              adviser–client relationship.
            </p>
          </div>
        </aside>
        <div className="contact-form-panel">
          <ContactForm />
        </div>
      </section>
    </>
  );
}

function LegalDocument({ type }: { type: "privacy" | "terms" }) {
  const privacy = type === "privacy";
  return (
    <>
      <section className="container interior-hero legal-hero">
        <p className="eyebrow">Website information</p>
        <h1 className="display">
          {privacy ? "Privacy notice." : "Website terms."}
        </h1>
        <p className="legal-draft-label">Last updated · 24 October 2026</p>
      </section>
      <div className="container legal-layout">
        <aside>
          <p className="eyebrow">A clear understanding</p>
          <p>
            {privacy
              ? "How this website handles browsing information and enquiries, and how to contact us about your information."
              : "The scope of the information on this website and the terms for using it."}
          </p>
          <a className="text-link" href="mailto:Shashwat@baliandpartners.in">
            Contact us <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </aside>
        <div className="legal-copy">
          {privacy ? (
            <>
              <section>
                <h2>1. About this notice</h2>
                <p>
                  This website presents the legal research, content, editorial
                  and communications services of Bali &amp; Partners, based in
                  New Delhi, India. Questions about this notice can be sent to{" "}
                  <a href="mailto:Shashwat@baliandpartners.in">
                    Shashwat@baliandpartners.in
                  </a>
                  .
                </p>
              </section>
              <section>
                <h2>2. Information you choose to provide</h2>
                <p>
                  The enquiry form asks for your name, organisation (optional),
                  preferred response method, enquiry category and a brief
                  message. Email enquiries require an email address. Callback
                  requests require a telephone number and let you indicate a
                  preferred time; an email address is optional. Please provide
                  only the information needed to explain your enquiry. Do not
                  submit confidential documents, case records or sensitive
                  personal information.
                </p>
                <p>
                  With your agreement, submissions pass through our
                  Vercel-hosted server to a private Supabase database for review
                  and follow-up. A receipt is shown only after storage is
                  confirmed. Your details are not stored in browser local
                  storage. If receipt cannot be confirmed, the form keeps your
                  details available for retry in the current page and offers
                  direct contact options.
                </p>
              </section>
              <section>
                <h2>3. How correspondence may be used</h2>
                <p>
                  If you choose to send an email or call, the information you
                  provide is available to the recipient so that your enquiry can
                  be considered and answered. Any subsequent assignment and
                  arrangements for handling its materials should be agreed
                  separately.
                </p>
                <p>
                  Enquiries are accessible to authorised administrators through
                  Supabase. New and closed requests are deleted automatically
                  after 180 days without an update. Requests actively being
                  handled may be kept while follow-up or an engagement
                  continues; the team should review those records regularly.
                  Correspondence handled outside the form may have a separate
                  retention period. Contact the address above about access,
                  correction or deletion.
                </p>
              </section>
              <section>
                <h2>4. Browsing and technical services</h2>
                <p>
                  This website does not include advertising trackers or
                  third-party analytics. Its fonts and visual assets are served
                  with the website. No optional marketing cookies are set by the
                  application. The enquiry form uses an essential, secure
                  session cookie lasting up to 30 minutes to validate
                  submissions. It contains a random identifier, not your name or
                  contact details.
                </p>
                <p>
                  Supabase stores the submitted contact details, message,
                  consent timestamp and request reference. The application also
                  retains keyed hashes of a network address and contact
                  identifier to limit abuse. Hashes older than 24 hours are
                  removed during submission processing or daily cleanup; raw IP
                  addresses are not written to the enquiry database. These controls do not
                  use advertising trackers. See{" "}
                  <a href="https://supabase.com/privacy">
                    Supabase’s privacy policy
                  </a>{" "}
                  for its processing practices.
                </p>
                <p>
                  The site is hosted by Vercel, which may process technical
                  request information, such as an IP address and browser
                  details, to deliver, secure and operate the site. See{" "}
                  <a href="https://vercel.com/legal/privacy-policy">
                    Vercel’s privacy policy
                  </a>{" "}
                  for information about its processing practices.
                </p>
              </section>
              <section>
                <h2>5. Questions and requests</h2>
                <p>
                  For a question about correspondence you have sent, or to
                  request correction or deletion, contact the email address
                  above. The response and any applicable rights will depend on
                  the relevant law and the circumstances of the request.
                </p>
                <p>
                  Do not send identity documents in an initial request. Any
                  necessary verification should be discussed through an
                  appropriate channel.
                </p>
              </section>
              <section>
                <h2>6. Future changes</h2>
                <p>
                  We may update this notice as the website and its services
                  change. The date above identifies the latest revision. Any
                  additional analytics tool, newsletter or change to the enquiry
                  service will be described here before it is enabled.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2>1. Purpose of this website</h2>
                <p>
                  This website provides information about Bali &amp; Partners’
                  legal research, content, editorial and professional
                  communications services. The website does not offer litigation
                  representation.
                </p>
              </section>
              <section>
                <h2>2. General information, not legal advice</h2>
                <p>
                  The material on this website is general information. It is not
                  a substitute for advice on a particular matter and should not
                  be relied on as a statement of the law applicable to your
                  circumstances.
                </p>
                <p>
                  The perspectives marked as editorial samples demonstrate the
                  editorial experience and are not published legal updates,
                  reported cases or advice.
                </p>
              </section>
              <section>
                <h2>3. Enquiries and engagements</h2>
                <p>
                  Contacting us or using the enquiry interface does not by
                  itself establish a professional engagement or an
                  adviser–client relationship. The scope, deliverables, fees and
                  other terms of any assignment require separate agreement.
                </p>
                <p>
                  Please do not send confidential documents, privileged material
                  or sensitive personal information with an initial enquiry.
                  Appropriate arrangements for sharing assignment materials
                  should be discussed first.
                </p>
              </section>
              <section>
                <h2>4. Use of the website</h2>
                <p>
                  Please use the site lawfully. Do not interfere with its
                  operation, attempt unauthorised access or use the enquiry
                  facilities to send abusive, misleading or unsolicited bulk
                  messages.
                </p>
                <p>
                  The website’s content and identity are provided for your
                  information. Rights in third-party materials remain with their
                  respective owners. Contact us before reusing business content
                  or brand assets beyond uses permitted by law.
                </p>
              </section>
              <section>
                <h2>5. Availability and external services</h2>
                <p>
                  Content may be revised and features may change. Access to the
                  website may occasionally be interrupted. Email, telephone and
                  external services operate independently of this website and
                  are subject to their own terms and technical requirements.
                </p>
              </section>
              <section>
                <h2>6. Changes and questions</h2>
                <p>
                  We may revise these terms when the website or its services
                  change. The date above identifies the latest revision. These
                  website terms do not replace the terms separately agreed for a
                  professional assignment.
                </p>
                <p>
                  For questions about the website, write to{" "}
                  <a href="mailto:Shashwat@baliandpartners.in">
                    Shashwat@baliandpartners.in
                  </a>
                  .
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function PrivacyPage() {
  return <LegalDocument type="privacy" />;
}
export function TermsPage() {
  return <LegalDocument type="terms" />;
}

export function NotFoundPage() {
  return (
    <section className="container not-found">
      <span className="eyebrow">404 / A page out of place</span>
      <h1 className="display">
        Let’s find
        <br />
        <em>a clearer path.</em>
      </h1>
      <p className="body-copy">
        The page you are looking for may have moved, or the address may be
        incomplete.
      </p>
      <div>
        <Link className="button button-dark" to="/">
          Return home <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <Link className="text-link" to="/expertise">
          Explore our expertise <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
