import { type ReactNode } from "react";
import NextImage from "next/image";

export type CardProps = {
  /**
   * Short description: A simple, reusable card container.
   * 
   * Params:
   * - children: ReactNode content to render inside the card.
   * - title: Optional title displayed at the top of the card.
   * - imageSrc: Optional image shown at the top of the card.
   * - imageAlt: Accessible alternative text for the image.
   * - href: Optional URL to navigate to when the card is clicked.
   */
  children: ReactNode;
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
};

/**
 * A presentational card container that can optionally display an image and title.
 * Adds hover animation when an href is provided.
 * 
 * Params:
 * - title: Optional heading shown above the body content.
 * - children: Body content of the card.
 * - imageSrc: Optional image URL to render at the top of the card.
 * - imageAlt: Accessible alternative text for the optional image.
 * - href: Optional URL to navigate to when clicked. External links open in a new tab.
 * 
 * Returns: A stylized, optionally clickable card element.
 */
export default function Card({ title, children, imageSrc, imageAlt, href }: CardProps) {
  const isExternal = href ? /^https?:\/\//i.test(href) : false;

  const commonStyle: React.CSSProperties = {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    background: "rgba(255,255,255,0.05)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "transform 150ms ease, box-shadow 150ms ease",
    willChange: "transform",
    overflow: "hidden",
  };

  const inner = (
    <>
      {imageSrc ? (
        <div style={{ margin: -16, marginBottom: 12 }}>
          <NextImage
            src={imageSrc}
            alt={imageAlt ?? ""}
            width={800}
            height={450}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority={false}
          />
        </div>
      ) : null}
      {title ? (
        <h2 style={{ margin: 0, marginBottom: 8, fontSize: 18 }}>{title}</h2>
      ) : null}
      {children}
      <style>{`
        .cardHover:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
        .cardHover:active { transform: translateY(0); }
        .cardHover:focus-visible { outline: 2px solid rgba(59,130,246,0.6); outline-offset: 2px; }
      `}</style>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="cardHover"
        style={commonStyle}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        aria-label={title ? `${title} – open` : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="cardHover" style={commonStyle}>
      {inner}
    </div>
  );
}


