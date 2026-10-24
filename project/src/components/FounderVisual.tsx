import type { ReactNode } from "react";

export type FounderPortrait = {
  src: string;
  alt: string;
  width: number;
  height: number;
};
// Add only an owner-approved local portrait, with its actual dimensions and permission to publish.
const approvedPortrait: FounderPortrait | undefined = undefined;

export default function FounderVisual({
  children,
  portrait = approvedPortrait,
}: {
  children: ReactNode;
  portrait?: FounderPortrait;
}) {
  if (!portrait) return <>{children}</>;
  return (
    <figure className="founder-portrait">
      <img
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        loading="lazy"
      />
      <figcaption>Shashwat Bali · Founder, Bali &amp; Partners</figcaption>
    </figure>
  );
}
