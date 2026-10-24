import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { articles, validateArticles } from "./data/content";
validateArticles(articles);
import * as Pages from "./pages/Pages";
import {
  metadataForPath,
  routes,
  renderMetadata,
  isProductionSite,
} from "./data/metadata";

export { routes, isProductionSite, metadataForPath };

export function render(path: string) {
  return {
    html: renderToString(
      <StaticRouter location={path}>
        <App pages={Pages} />
      </StaticRouter>,
    ),
    head: renderMetadata(metadataForPath(path)),
  };
}
