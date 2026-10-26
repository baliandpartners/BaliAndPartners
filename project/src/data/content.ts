export interface Service {
  number: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  deliverables: string[];
  deliverableDetails: string[];
  audience: string;
  question: string;
  principles: { title: string; text: string }[];
  firstAssignment: string;
  workflow: string;
  clientResponsibility: string;
}

export const services: Service[] = [
  {
    number: "01",
    slug: "legal-research",
    firstAssignment:
      "A focused research note on an agreed legal question, jurisdiction and period, with a source list and clearly identified limits.",
    workflow:
      "We agree the research question, examine primary authorities and relevant commentary, then organise findings, competing interpretations and points requiring further review.",
    clientResponsibility:
      "The commissioning professional confirms the scope and assesses how the research applies to a particular matter. Advice, litigation strategy and final legal decisions remain with the responsible professional.",
    title: "Legal Research & Analysis",
    shortTitle: "Legal Research",
    description:
      "The substance behind the sentence. Focused research that gives complex legal ideas a clear foundation.",
    intro:
      "Good legal communication starts well before the first draft. We help define the question, examine relevant materials and organise the findings into a useful foundation for writing and editorial decision-making.",
    deliverables: [
      "Issue-focused research notes",
      "Case-law and statutory research",
      "Judgment summaries and regulatory backgrounders",
      "Source mapping and research outlines",
      "Research support for long-form publications",
    ],
    deliverableDetails: [
      "Focused notes that define the legal question, identify governing authorities and separate the central position from material qualifications. The note brings together a concise answer, the reasoning behind it and points that need further review, within the agreed jurisdiction and date range.",
      "Targeted review of judgments, legislation and amendments, with citations and source references organised for verification. Findings can be arranged by issue or chronology, with conflicting authorities and changes in the law flagged for the commissioning professional to assess.",
      "Clear explanations of decisions and regulatory developments, setting out the background, principal findings and relevant implications. Each summary distinguishes the holding or operative change from commentary, so readers can see what has changed and where the original material can be checked.",
      "Structured source lists and research plans showing the foundation of an issue, unresolved points and areas for further enquiry. An annotated outline connects proposed sections with the authorities needed to support them and makes gaps visible before drafting starts.",
      "Background research, issue mapping and source support for articles, guides and other substantial legal publications. Research can be organised by chapter or theme, with a source register that helps authors and reviewers trace the basis of the final text.",
    ],
    audience:
      "For legal professionals, publishers and in-house teams developing substantive written work.",
    question: "What does your next piece of work need to understand?",
    principles: [
      {
        title: "A defined question",
        text: "Agree the scope, jurisdiction, purpose and limits of the research before gathering material.",
      },
      {
        title: "A traceable foundation",
        text: "Keep sources and assumptions visible so that findings can be checked and developed.",
      },
      {
        title: "A useful structure",
        text: "Distinguish the central issue from background detail, qualifications and questions that remain open.",
      },
    ],
  },
  {
    number: "02",
    slug: "legal-content-editorial",
    firstAssignment:
      "One research-backed article or judgment explainer, developed from an agreed brief and source material.",
    workflow:
      "We agree whether the assignment covers drafting, technical editing, proofreading or substantive source checks. An outline and draft move through editorial feedback and the agreed review stages.",
    clientResponsibility:
      "The author or commissioning team approves the legal analysis, citations, attribution and final text. Ghostwriting and publishing rights are agreed before work begins.",
    title: "Legal Content & Editorial",
    shortTitle: "Content & Editorial",
    description:
      "Writing and editing that respect the law, the reader and the voice behind the work.",
    intro:
      "From an early outline to a considered final draft, we develop legal content with attention to meaning, structure and voice. Editorial and ghostwriting assignments are shaped around the author’s expertise and the needs of the intended reader.",
    deliverables: [
      "Research-backed articles and judgment analysis",
      "Statutory and regulatory explainers",
      "Technical editing and agreed citation checks",
      "Ghostwriting and substantive editorial support",
      "Long-form manuscript development",
      "Structural editing and publication preparation",
    ],
    deliverableDetails: [
      "Research-led drafts organised around a defined legal issue, with a coherent argument, supporting sources and editorial review. The agreed output may be a publication-ready article or an analysis draft for specialist review, with factual statements and interpretation kept distinct.",
      "Reader-focused explanations of statutory provisions, rules and developments, including important conditions and qualifications. Structure, terminology and examples are tailored to the intended audience, while commencement dates, exceptions and unresolved questions remain visible.",
      "Line-by-line review of terminology, structure and citation consistency to the level agreed in the brief. An edited draft and queries help the author resolve ambiguous wording or unsupported statements; the depth of source verification is agreed before work begins.",
      "Drafting and substantive editing in the commissioning professional’s voice, subject to their review and final approval. Interviews, notes and supplied materials inform the draft. Attribution, confidentiality and publishing rights are settled as part of the assignment.",
      "Planning, chapter structure and iterative editorial development for in-depth guides, reports and manuscripts. Work can include a synopsis, chapter outlines and a consistent terminology framework, with review milestones matched to the scale of the publication.",
      "Final structural checks, proofreading and preparation against the agreed publishing requirements. Headings, cross-references, citations and formatting are reviewed together so the author or publisher receives a coherent handover for final approval.",
    ],
    audience:
      "For advocates, law firms, legal publishers and professional organisations with something substantive to say.",
    question: "What deserves a clearer expression?",
    principles: [
      {
        title: "Substance before polish",
        text: "Resolve the argument and its qualifications before refining the language.",
      },
      {
        title: "A recognisable voice",
        text: "Work from the author’s perspective, vocabulary and intended relationship with the reader.",
      },
      {
        title: "Considered review",
        text: "Make space for the subject-matter owner to verify accuracy, nuance and final approval.",
      },
    ],
  },
  {
    number: "03",
    slug: "thought-leadership",
    firstAssignment:
      "An interview-led commentary piece that develops a professional’s own perspective on a clearly defined issue.",
    workflow:
      "A discussion establishes the author’s reasoning. Research tests the supporting material; a structured draft then develops the argument through editorial review.",
    clientResponsibility:
      "The named author supplies their genuine perspective and retains substantive judgment and final approval. No opinions, experiences or professional associations are invented.",
    title: "Thought Leadership",
    shortTitle: "Thought Leadership",
    description:
      "A considered point of view, developed into work that contributes to the conversation.",
    intro:
      "A useful perspective does more than repeat the news. We help shape professional knowledge into a clear argument: why an issue matters, what deserves closer attention and how the intended audience can think about it.",
    deliverables: [
      "Perspective and commentary articles",
      "Knowledge-publication concepts and outlines",
      "Interview-led author development",
      "Thematic editorial series",
    ],
    deliverableDetails: [
      "Commentary developing the author’s distinctive professional position with appropriate research and nuance. The process clarifies the central proposition, considers counterarguments and identifies what the piece adds to the existing discussion.",
      "Publication themes, suggested formats and outlines designed around the audience and a genuine area of expertise. A concept note can set out the reader question, proposed argument and supporting material before the author commits to a full draft.",
      "Interview-based drafting that captures the author’s actual reasoning rather than substituting a generic viewpoint. Structured conversations produce an agreed outline and draft, with quotations, examples and substantive positions returned to the author for verification.",
      "A connected series of articles exploring a theme over time with consistent voice and editorial direction. A series plan gives each piece a distinct purpose, proposes a useful reading order and avoids unnecessary repetition between instalments.",
    ],
    audience:
      "For professionals and organisations seeking to share a distinctive, well-supported perspective.",
    question: "Which conversation can your perspective help advance?",
    principles: [
      {
        title: "A real point of view",
        text: "Begin with the author’s own understanding and experience, rather than a generic opinion.",
      },
      {
        title: "A reason to read",
        text: "Make the contribution clear: a useful distinction, a new question or a carefully argued interpretation.",
      },
      {
        title: "Room for nuance",
        text: "Express a position without losing uncertainty, counterarguments or relevant limits.",
      },
    ],
  },
  {
    number: "04",
    slug: "content-strategy",
    firstAssignment:
      "A review of one practice-area content collection, followed by a prioritised editorial plan.",
    workflow:
      "We review existing material and audience questions, map gaps and connections, and propose formats, a publishing calendar and a maintenance process suited to available capacity.",
    clientResponsibility:
      "The organisation approves priorities, assigns subject-matter reviewers and confirms publishing resources. Search-informed planning does not guarantee rankings or enquiries.",
    title: "Content Strategy",
    shortTitle: "Content Strategy",
    description:
      "A coherent editorial direction, from what to publish to how the right reader finds it.",
    intro:
      "Individual pieces work better when they belong to a clear body of knowledge. We help organise topics, formats and publishing priorities around the audience, with legal SEO and content architecture supporting that editorial purpose.",
    deliverables: [
      "Content audits and editorial roadmaps",
      "Practice-area plans and editorial calendars",
      "Knowledge architecture and publication maintenance",
      "Search-informed legal content briefs",
      "Website content structure and messaging",
    ],
    deliverableDetails: [
      "A considered review of existing content to identify gaps, overlap, outdated material and priorities for improvement. The resulting inventory separates material to retain, update, combine or retire, and turns the findings into an actionable sequence of editorial work.",
      "Practice-specific topic clusters, formats and a realistic publishing schedule aligned with audience needs and available review capacity. Each planned piece has a defined reader, purpose and review owner, making it easier to sustain the programme without publishing for volume alone.",
      "An organised content structure, internal links and a maintenance process to keep related publications useful and up to date. Work can include a taxonomy, naming conventions and review triggers so readers can navigate the collection and the team can maintain it.",
      "Research-based writing briefs connecting audience questions and search intent with sound legal sources and a clear proposed structure. Briefs identify the scope, key questions, suggested headings and related pages, while leaving final legal analysis to the responsible reviewer.",
      "Practice-page hierarchy, website content structure and measured messaging that makes the firm’s services understandable without inflated claims. Page outlines and copy guidance connect each service with its intended audience, the work involved and a clear next step for an appropriate enquiry.",
    ],
    audience:
      "For legal and professional-services teams building or refining a coherent publishing presence.",
    question: "What should your body of work be known for?",
    principles: [
      {
        title: "Audience before volume",
        text: "Identify the questions readers actually bring, and the level of detail they need.",
      },
      {
        title: "A connected body of work",
        text: "Give each page and publication a clear role, with useful relationships between them.",
      },
      {
        title: "Discoverability with purpose",
        text: "Use clear structure, descriptive language and search intent without compromising editorial judgment.",
      },
    ],
  },
  {
    number: "05",
    slug: "professional-communications",
    firstAssignment:
      "A professional biography and a small set of agreed messages for a profile or public announcement.",
    workflow:
      "We collect verified background information, agree the audience and tone, and develop copy for factual, editorial and professional-conduct review.",
    clientResponsibility:
      "The individual or firm confirms all credentials, permissions and claims and obtains any required professional-conduct approval before publication.",
    title: "Professional Communications",
    shortTitle: "Professional Communications",
    description:
      "A consistent professional voice across LinkedIn, profiles and public-facing communication.",
    intro:
      "Professional visibility depends on what is said and how it is expressed. We support clear, considered communication that reflects the individual or organisation behind it, with the restraint appropriate to the legal sector.",
    deliverables: [
      "LinkedIn editorial planning and writing",
      "Professional profiles and biographies",
      "Firm narratives and professional announcements",
      "Editorial voice and communication guidance",
    ],
    deliverableDetails: [
      "Editorial plans and LinkedIn posts shaped around verified expertise, professional context and the intended readership. The work can include themes, draft posts and an approval calendar; publication and any required professional-conduct review remain with the account owner.",
      "Biographies that present education, professional experience and areas of focus clearly and in proportion. Long and short versions can be prepared for a website, speaker introduction or professional profile, using only background information the individual has verified.",
      "Firm introductions and announcements communicating genuine developments in a restrained, accurate professional voice. The message is adapted to the channel and audience, with names, roles, dates and permissions checked by the commissioning team before release.",
      "Tone-of-voice principles and practical editorial standards to maintain consistency across platforms. A concise guide can cover terminology, style, attribution and review responsibilities, supported by examples the team can use in day-to-day writing.",
    ],
    audience:
      "For legal professionals and specialist organisations seeking a more considered public voice.",
    question: "How should your professional perspective come across?",
    principles: [
      {
        title: "Credible positioning",
        text: "Build from information that can be substantiated, without inflated claims or manufactured authority.",
      },
      {
        title: "Consistent expression",
        text: "Establish a tone and editorial rhythm that remain recognisable across formats.",
      },
      {
        title: "Professional context",
        text: "Account for the audience and applicable professional-conduct considerations when planning content.",
      },
    ],
  },
];

export interface ArticleSection {
  id: string;
  title: string;
  paragraphs: string[];
  sourceIds?: string[];
}

interface ArticleBase {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  description: string;
  standfirst: string;
  sections: ArticleSection[];
  relatedSlugs?: string[];
}

export interface ArticleSource {
  id: string;
  title: string;
  citation: string;
  url: string;
}
export type Article = ArticleBase &
  (
    | { kind: "sample"; label: "Editorial sample" }
    | {
        kind: "publication";
        label: "Legal perspective";
        approved: true;
        author: { name: string; role?: string };
        publishedAt: string;
        reviewedAt?: string;
        updatedAt?: string;
        jurisdiction: string;
        sources: ArticleSource[];
        qualifications: string;
        disclaimer: string;
        indexable: boolean;
      }
  );

/** Publication records must be approved and supplied with verified source material. */
export function isIndexableArticle(article: Article) {
  return (
    article.kind === "publication" &&
    article.approved === true &&
    article.indexable
  );
}

export const articles: Article[] = [
  {
    slug: "precision-before-publication",
    title: "Precision begins before the first sentence.",
    category: "Editorial Perspectives",
    excerpt:
      "Why defining the question is the first act of good legal writing.",
    description:
      "An editorial sample exploring how scope, structure and review help make legal writing clearer.",
    standfirst:
      "Clear legal writing is often described as a matter of style. More often, it is the visible result of decisions made before the writing begins.",
    kind: "sample",
    label: "Editorial sample",
    sections: [
      {
        id: "define-the-question",
        title: "Define the question before the answer.",
        paragraphs: [
          "A broad topic is not yet a useful brief. “Write about a regulatory development” leaves the most important decisions unresolved: who is reading, what they already understand, and which question the piece is meant to help them consider.",
          "A stronger starting point is a sentence that defines the purpose of the work. It may be to explain a change, distinguish two interpretations, or identify practical questions for further assessment. The narrower question does not make the writing less ambitious. It gives the ambition a direction.",
          "Scope also makes limits visible. The relevant jurisdiction, time period and intended audience shape the research. If a piece cannot answer a question responsibly within those boundaries, it should say so rather than conceal the gap with confident language.",
        ],
      },
      {
        id: "build-the-structure",
        title: "Let the structure do some of the work.",
        paragraphs: [
          "A reader should not have to reconstruct the writer’s research process. The order in which materials were discovered is rarely the order in which an argument is best understood. Research notes and a finished article serve different purposes.",
          "A useful structure places the central point early, supplies the context needed to understand it, and then works through the relevant distinctions. Qualifications belong close to the statements they qualify. Background material earns its place by helping the reader follow the argument.",
          "This is also a way to identify unfinished thinking. If a section cannot be summarised in a clear sentence, the problem may be conceptual rather than stylistic. Moving words around will not resolve a question that has not yet been answered.",
        ],
      },
      {
        id: "review-the-meaning",
        title: "Review meaning, then expression.",
        paragraphs: [
          "An editorial review should first ask whether the draft says what it intends to say. Are propositions supported? Have important exceptions survived the editing? Does a shorthand expression introduce a certainty that the underlying material does not justify?",
          "Only then does sentence-level refinement become reliable. Shorter sentences, active verbs and familiar words are useful tools, but none is an end in itself. A precise qualification may need space. A technical term may be the clearest available choice for the intended reader.",
          "The final standard is not simplicity at any cost. It is an accurate relationship between the substance and its expression: enough detail to be useful, enough restraint to remain readable, and no more certainty than the material allows.",
        ],
      },
    ],
  },
  {
    slug: "a-point-of-view-worth-publishing",
    title: "A point of view is more than a position.",
    category: "Commentary",
    excerpt:
      "What gives professional commentary a reason to exist beyond the news cycle.",
    description:
      "An editorial sample on developing useful, well-supported professional commentary.",
    standfirst:
      "The value of professional commentary lies in the thinking it contributes. A strong opinion can attract attention; a carefully developed perspective gives the reader something to retain.",
    kind: "sample",
    label: "Editorial sample",
    sections: [
      {
        id: "start-with-a-distinction",
        title: "Start with a distinction worth making.",
        paragraphs: [
          "Many professional articles begin with an event. An announcement, a judgment or a policy discussion supplies a timely occasion to write. But the event alone does not explain why another piece should be added to the conversation.",
          "The editorial question is what the author can help the reader see more clearly. Perhaps two issues have been treated as one. Perhaps a familiar interpretation rests on an assumption that deserves examination. Perhaps the practical significance of a development depends on context that short updates have omitted.",
          "A distinctive perspective need not be a contrarian one. A careful explanation of an overlooked qualification may be more useful than a dramatic disagreement. The contribution is the clarity of the distinction, not the volume of the claim.",
        ],
      },
      {
        id: "make-the-reasoning-visible",
        title: "Make the reasoning visible.",
        paragraphs: [
          "Readers can evaluate an argument more fairly when they can see how it was reached. An assertion followed by a confident conclusion asks for trust. An explanation that shows its premises, evidence and limits gives the reader grounds on which to assess it.",
          "This does not require a piece to reproduce every research note. It requires the writer to identify which steps are essential to the argument and which claims need support. Where competing interpretations exist, acknowledging them can sharpen the position rather than weaken it.",
          "An author’s perspective should remain recognisable throughout this process. Editorial support is most useful when it helps articulate that perspective with greater precision, while leaving the substantive judgment and final approval with the author.",
        ],
      },
      {
        id: "leave-the-reader-with-something",
        title: "Give the reader a useful next thought.",
        paragraphs: [
          "The closing paragraph does not need to announce a sweeping conclusion. It can identify the question that deserves attention next, explain a distinction worth retaining, or state which developments would alter the analysis.",
          "This is especially useful when the subject remains unsettled. A measured account of what is known, what is uncertain and why the uncertainty matters can be more valuable than a prediction presented as inevitability.",
          "The aim is a piece that earns its place in a professional conversation. Its value should remain legible after the headline that prompted it has passed out of view.",
        ],
      },
    ],
  },
  {
    slug: "designing-a-legal-content-library",
    title: "Build a body of knowledge. Not just a feed.",
    category: "Content Strategy",
    excerpt:
      "An editorial approach to making specialist knowledge easier to find, use and maintain.",
    description:
      "An editorial sample about organising a legal content library around readers and meaningful connections.",
    standfirst:
      "Publishing creates an archive. Editorial strategy gives that archive a shape: a connected body of work that remains useful beyond the day each piece appears.",
    kind: "sample",
    label: "Editorial sample",
    sections: [
      {
        id: "begin-with-reader-questions",
        title: "Begin with the reader’s questions.",
        paragraphs: [
          "A publishing calendar tells a team when to publish. It does not, by itself, explain what the body of work is meant to help a reader understand. That requires a separate view of the subject and the questions that bring an audience to it.",
          "Some readers need an introduction. Others are looking for a specific distinction, an update or a more developed argument. Giving these needs separate roles helps determine the right format and level of detail for each piece.",
          "The result is not a requirement to cover every possible topic. A focused collection can be more coherent than a large one. Editorial priorities should reflect the organisation’s actual knowledge, the audience’s needs and the resources available to maintain the work.",
        ],
      },
      {
        id: "design-the-connections",
        title: "Design the connections, not only the pages.",
        paragraphs: [
          "A useful article can become difficult to find if it is connected only to the date on which it was published. Clear topic groupings, descriptive titles and relevant internal links give the reader more than one way into the material.",
          "These connections should explain a relationship. An introductory piece might lead to a narrower analysis. A current update might point back to essential background. Related reading should help the reader continue a line of inquiry, rather than simply display the latest three posts.",
          "Search considerations can support this work when they are treated as evidence about the language readers use. They should not displace professional judgment or turn a careful explanation into a list of repeated keywords.",
        ],
      },
      {
        id: "plan-for-maintenance",
        title: "Treat maintenance as editorial work.",
        paragraphs: [
          "A content library is not finished at publication. Some pieces will need factual review, others clearer context, and some may cease to be useful. A publishing plan should leave room for those decisions.",
          "A practical review process can record the purpose of a piece, the subject-matter owner and the circumstances that would trigger an update. For legal material, the date and scope of the analysis may be essential context for the reader.",
          "A considered body of knowledge grows through selection as much as addition. Its strength lies in the relationship between its parts, the clarity of its organisation and the care with which it is kept useful.",
        ],
      },
    ],
  },
];

/** Estimate from the actual standfirst and article body, at 200 words per minute. */
export function readingTime(article: Article): string {
  const text = [
    article.standfirst,
    ...article.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
    ]),
  ].join(" ");
  return `${Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200))} min read`;
}

/** Reject incomplete publication records before any static pages are emitted. */
export function validateArticles(records: Article[]) {
  const slugs = new Set<string>();
  const date = (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value;
  for (const article of records) {
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) ||
      slugs.has(article.slug)
    )
      throw new Error(`Invalid or duplicate article slug: ${article.slug}`);
    slugs.add(article.slug);
    if (
      !article.title.trim() ||
      !article.standfirst.trim() ||
      !article.sections.length
    )
      throw new Error(`Incomplete article: ${article.slug}`);
    const ids = article.sections.map((section) => section.id);
    if (
      new Set(ids).size !== ids.length ||
      ids.some((id) => !/^[a-z0-9-]+$/.test(id))
    )
      throw new Error(`Invalid section anchors: ${article.slug}`);
    if (article.kind === "publication") {
      if (
        article.approved !== true ||
        !article.author.name.trim() ||
        !date(article.publishedAt) ||
        (article.reviewedAt && !date(article.reviewedAt)) ||
        (article.updatedAt &&
          (!date(article.updatedAt) ||
            article.updatedAt < article.publishedAt)) ||
        !article.jurisdiction.trim() ||
        !article.qualifications.trim() ||
        !article.disclaimer.trim() ||
        !article.sources.length
      )
        throw new Error(
          `Publication approval, attribution, dates or sources missing: ${article.slug}`,
        );
      const sourceIds = new Set<string>();
      for (const source of article.sources) {
        if (
          !/^[a-z0-9-]+$/.test(source.id) ||
          sourceIds.has(source.id) ||
          ids.includes(`source-${source.id}`) ||
          !source.title.trim() ||
          !source.citation.trim()
        )
          throw new Error(`Invalid source: ${article.slug}`);
        const url = new URL(source.url);
        if (url.protocol !== "https:" || url.username || url.password)
          throw new Error(
            `Source must use a public HTTPS URL: ${article.slug}`,
          );
        sourceIds.add(source.id);
      }
      if (
        article.sections.some((section) =>
          section.sourceIds?.some((id) => !sourceIds.has(id)),
        )
      )
        throw new Error(`Unresolved citation: ${article.slug}`);
    }
  }
  for (const article of records) {
    if (
      article.relatedSlugs?.some(
        (slug) => !slugs.has(slug) || slug === article.slug,
      )
    )
      throw new Error(`Invalid related reading: ${article.slug}`);
  }
}
