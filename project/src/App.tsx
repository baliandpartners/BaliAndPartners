import { lazy, type ComponentType } from "react";
import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import Home from "./pages/Home";

type PageName =
  | "AboutPage"
  | "ApproachPage"
  | "ArticlePage"
  | "ContactPage"
  | "ExpertisePage"
  | "InsightsPage"
  | "NotFoundPage"
  | "PrivacyPage"
  | "ServicePage"
  | "TermsPage";
type PageComponents = Record<PageName, ComponentType>;
const loadPage = (name: PageName) =>
  lazy(() =>
    import("./pages/Pages").then((module) => ({ default: module[name] })),
  );
const clientPages: PageComponents = {
  AboutPage: loadPage("AboutPage"),
  ApproachPage: loadPage("ApproachPage"),
  ArticlePage: loadPage("ArticlePage"),
  ContactPage: loadPage("ContactPage"),
  ExpertisePage: loadPage("ExpertisePage"),
  InsightsPage: loadPage("InsightsPage"),
  NotFoundPage: loadPage("NotFoundPage"),
  PrivacyPage: loadPage("PrivacyPage"),
  ServicePage: loadPage("ServicePage"),
  TermsPage: loadPage("TermsPage"),
};

/** The static renderer supplies eagerly loaded pages; browsers load interior pages on demand. */
export default function App({
  pages = clientPages,
}: {
  pages?: PageComponents;
}) {
  const {
    AboutPage,
    ApproachPage,
    ArticlePage,
    ContactPage,
    ExpertisePage,
    InsightsPage,
    NotFoundPage,
    PrivacyPage,
    ServicePage,
    TermsPage,
  } = pages;
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/expertise" element={<ExpertisePage />} />
        <Route path="/expertise/:slug" element={<ServicePage />} />
        <Route path="/approach" element={<ApproachPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/insights/:slug" element={<ArticlePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
