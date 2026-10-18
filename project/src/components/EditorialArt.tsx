import { useState } from "react";
/** Original vector composition: a document becomes an architectural space. */
export default function EditorialArt() {
  const [focus, setFocus] = useState(false);
  return (
    <div
      className={`editorial-art${focus ? " art-focused" : ""}`}
      onPointerEnter={() => setFocus(true)}
      onPointerLeave={() => setFocus(false)}
      aria-hidden="true"
    >
      <svg className="art-geometry" viewBox="0 0 500 570" fill="none">
        <defs>
          <pattern
            id="fine-lines"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 0V9" stroke="currentColor" strokeWidth=".55" />
          </pattern>
        </defs>
        <path
          className="art-outline"
          d="M65 480V230a185 185 0 0 1 370 0v250H65Z"
          stroke="currentColor"
          strokeWidth=".7"
        />
        <path
          className="art-arch"
          d="M92 480V236a158 158 0 0 1 316 0v244H92Z"
          fill="url(#fine-lines)"
        />
        <path
          d="M250 17v501M31 480h438M52 236h396"
          stroke="currentColor"
          strokeWidth=".65"
          strokeDasharray="2 6"
          opacity=".4"
        />
        <circle
          cx="250"
          cy="236"
          r="122"
          stroke="currentColor"
          strokeWidth=".6"
          opacity=".55"
        />
        <path
          d="M123 480V230a127 127 0 0 1 254 0v250"
          stroke="currentColor"
          strokeWidth=".7"
        />
        <path
          d="M188 480V235a62 62 0 0 1 124 0v245"
          fill="var(--paper)"
          stroke="currentColor"
          strokeWidth=".6"
        />
        <path
          d="M65 501h370M65 496v10M435 496v10"
          stroke="currentColor"
          strokeWidth=".6"
        />
        <text
          x="250"
          y="523"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="DM Sans Variable, sans-serif"
          fontSize="8"
          letterSpacing="3"
        >
          SPACE FOR CLEAR THINKING
        </text>
      </svg>
      <div className="art-document">
        <div className="document-label">
          A considered perspective <span>01 /</span>
        </div>
        <div className="document-heading">
          The power
          <br />
          of a well-
          <br />
          <em>chosen word.</em>
        </div>
        <div className="document-rule" />
        <div className="document-lines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="document-note">Substance, thoughtfully expressed.</div>
        <span className="document-mark">&</span>
      </div>
      <span className="art-caption">FIG. 01 — THE ART OF CLARITY</span>
    </div>
  );
}
