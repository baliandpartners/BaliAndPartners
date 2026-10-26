import type { ReactNode } from "react";

export type FounderPortrait = {
  src: string;
  alt: string;
  srcSet?: string;
  width: number;
  height: number;
};
// Add only an owner-approved local portrait, with its actual dimensions and permission to publish.
const approvedPortrait: FounderPortrait = {
  src: "/images/shashwat-bali-800.webp",
  srcSet:
    "/images/shashwat-bali-480.webp 480w, /images/shashwat-bali-800.webp 800w, /images/shashwat-bali-1200.webp 1200w",
  alt: "Shashwat Bali, founder of Bali & Partners",
  width: 1200,
  height: 1202,
};

export default function FounderVisual({
  children,
  portrait = approvedPortrait,
  loading = "lazy",
}: {
  children: ReactNode;
  portrait?: FounderPortrait;
  loading?: "eager" | "lazy";
}) {
  if (!portrait) return <>{children}</>;
  return (
    <figure className="founder-portrait">
      <img
        src={portrait.src}
        alt={portrait.alt}
        srcSet={portrait.srcSet}
        sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 42vw, 620px"
        width={portrait.width}
        height={portrait.height}
        loading={loading}
        decoding="async"
      />
      <figcaption>Shashwat Bali · Founder, Bali &amp; Partners</figcaption>
    </figure>
  );
}
