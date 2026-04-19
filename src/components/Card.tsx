"use client";

import { Card } from "@heroui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import type { ReactNode } from "react";

export type CardProps = {
  children: ReactNode;
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
};

const imageHeightPx = 160;

/**
 * Post preview card (HeroUI Card); internal routes use Next.js Link.
 */
export default function PostCard({
  title,
  children,
  imageSrc,
  imageAlt,
  href,
}: CardProps) {
  const isExternal = href ? /^https?:\/\//i.test(href) : false;

  const resolvedImageSrc = (() => {
    if (!imageSrc) return undefined;
    const trimmed = imageSrc.trim();
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/"))
      return trimmed;
    if (href) {
      const base = href.replace(/\/+$/, "");
      const rel = trimmed.replace(/^\.?\/+/, "");
      return `${base}/${rel}`;
    }
    return `/${trimmed.replace(/^\.?\/+/, "")}`;
  })();

  const inner = (
    <Card
      variant="secondary"
      className="h-full gap-0 overflow-hidden p-0 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {resolvedImageSrc ? (
        <div
          className="relative w-full shrink-0 overflow-hidden"
          style={{ height: imageHeightPx }}
        >
          <NextImage
            src={resolvedImageSrc}
            alt={imageAlt ?? ""}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
      ) : null}
      <Card.Header className="gap-1 px-4 pt-3 pb-0">
        {title ? <Card.Title className="text-base">{title}</Card.Title> : null}
      </Card.Header>
      {children ? (
        <Card.Content className="text-muted px-4 pb-4 text-sm">
          {children}
        </Card.Content>
      ) : null}
    </Card>
  );

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          className="text-foreground block h-full no-underline focus-visible:outline-none"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={title ? `${title} – open` : undefined}
        >
          {inner}
        </a>
      );
    }
    return (
      <NextLink
        href={href}
        className="text-foreground block h-full no-underline focus-visible:outline-none"
        aria-label={title ? `${title} – open` : undefined}
      >
        {inner}
      </NextLink>
    );
  }

  return inner;
}
