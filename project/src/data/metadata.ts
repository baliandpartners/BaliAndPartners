import { articles, services } from "./content";

declare const __SITE_IS_PRODUCTION__: boolean;

export const SITE_URL = "https://www.baliandpartners.in";
export const isProductionSite =
  typeof __SITE_IS_PRODUCTION__ !== "undefined" && __SITE_IS_PRODUCTION__;

export interface PageMetadata {
  path: string;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  type: "website" | "article";
  image: string;
  structuredData: Record<string, unknown>[];
}

const pages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Bali & Partners — Legal substance. Editorial precision.",
    description:
      "Research-led legal content, editorial strategy and thought leadership for law firms, legal teams and professional organisations. Every word, considered.",
  },
  "/expertise": {
    title: "Our expertise — Bali & Partners",
    description:
      "Explore our legal research, editorial content, thought leadership, content strategy and professional communications services.",
  },
  "/approach": {
    title: "A considered approach — Bali & Partners",
    description:
      "From understanding your brief to careful research, editorial development and review: discover how Bali & Partners works.",
  },
  "/insights": {
    title: "Perspectives & insights — Bali & Partners",
    description:
      "Editorial perspectives on legal writing, thought leadership and creating useful knowledge for professional audiences.",
  },
  "/about": {
    title: "About the practice — Bali & Partners",
    description:
      "Meet the thinking behind Bali & Partners, an independent legal content and strategy practice built around clarity, care and editorial judgement.",
  },
  "/contact": {
    title: "Start a conversation — Bali & Partners",
    description:
      "Tell Bali & Partners about your legal content, research or editorial project. Explore the right support for your organisation.",
  },
  "/privacy": {
    title: "Privacy notice — Bali & Partners",
    description:
      "How this Bali & Partners website handles browsing information and contact enquiries, and how to raise a privacy question.",
  },
  "/terms": {
    title: "Website terms — Bali & Partners",
    description:
      "Terms for using the Bali & Partners website, including editorial content, intellectual property and the scope of information provided.",
  },
};

export const routes = [
  ...Object.keys(pages),
  ...services.map((service) => `/expertise/${service.slug}`),
  ...articles.map((article) => `/insights/${article.slug}`),
];

const organisation = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Bali & Partners",
  url: SITE_URL,
  description: "An independent legal content and editorial strategy practice.",
  logo: `${SITE_URL}/PRIMARY%20LOGO%20B&P%201..001.png`,
};

export function metadataForPath(pathname: string): PageMetadata {
  const path = pathname.split("?")[0].replace(/\/+$/, "") || "/";
  const service = services.find((item) => path === `/expertise/${item.slug}`);
  const article = articles.find((item) => path === `/insights/${item.slug}`);
  const record = service || article;
  const known = Boolean(pages[path] || record);
  const title = record
    ? `${record.title} — Bali & Partners`
    : pages[path]?.title || "Page not found — Bali & Partners";
  const description =
    record?.description ||
    pages[path]?.description ||
    "This page could not be found. Explore Bali & Partners legal content and editorial strategy services.";
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
  const structuredData: Record<string, unknown>[] = known ? [organisation] : [];

  if (known && path !== "/") {
    const section = path.startsWith("/expertise/")
      ? { name: "Expertise", path: "/expertise" }
      : path.startsWith("/insights/")
        ? { name: "Insights", path: "/insights" }
        : undefined;
    const breadcrumbs = [
      { name: "Home", path: "/" },
      ...(section ? [section] : []),
      { name: title.replace(" — Bali & Partners", ""), path },
    ];
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    });
  }

  if (service)
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.description,
      url: canonical,
      provider: { "@id": `${SITE_URL}/#organization` },
    });

  return {
    path,
    title,
    description,
    canonical,
    robots:
      isProductionSite && known && !article
        ? "index, follow"
        : "noindex, nofollow",
    type: article ? "article" : "website",
    image: `${SITE_URL}/PRIMARY%20LOGO%20B&P%201..001.png`,
    structuredData,
  };
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] || character,
  );
}

export function renderMetadata(metadata: PageMetadata) {
  const tags = [
    `<title>${escapeHtml(metadata.title)}</title>`,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="robots" content="${metadata.robots}" />`,
    `<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`,
    `<meta property="og:site_name" content="Bali &amp; Partners" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:type" content="${metadata.type}" />`,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(metadata.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(metadata.image)}" />`,
    `<meta property="og:image:alt" content="Bali &amp; Partners" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(metadata.image)}" />`,
    `<script id="page-structured-data" type="application/ld+json">${JSON.stringify(metadata.structuredData).replace(/</g, "\\u003c")}</script>`,
  ];
  return tags.join("\n    ");
}

/** Keep document metadata accurate after client-side navigation. */
export function applyPageMetadata(path: string) {
  if (typeof document === "undefined") return;
  const metadata = metadataForPath(path);
  document.title = metadata.title;
  const template = document.createElement("template");
  template.innerHTML = renderMetadata(metadata);
  for (const element of Array.from(template.content.children)) {
    if (element.tagName === "TITLE") continue;
    const selector = element.id
      ? `#${element.id}`
      : element.tagName === "LINK"
        ? 'link[rel="canonical"]'
        : element.hasAttribute("name")
          ? `meta[name="${element.getAttribute("name")}"]`
          : `meta[property="${element.getAttribute("property")}"]`;
    const existing = document.head.querySelector(selector);
    if (existing) existing.replaceWith(element);
    else document.head.append(element);
  }
}
