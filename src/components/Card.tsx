"use client";

import { Card as HeroCard } from "@heroui/react";
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

export default function Card({
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
    <HeroCard
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
      <HeroCard.Header className="gap-1 px-4 pt-3 pb-0">
        {title ? (
          <HeroCard.Title className="text-base">{title}</HeroCard.Title>
        ) : null}
      </HeroCard.Header>
      {children ? (
        <HeroCard.Content className="px-4 pb-4 text-sm opacity-80">
          {children}
        </HeroCard.Content>
      ) : null}
    </HeroCard>
  );

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          className="block h-full no-underline focus-visible:outline-none"
          style={{ color: "inherit" }}
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
        className="block h-full no-underline focus-visible:outline-none"
        style={{ color: "inherit" }}
        aria-label={title ? `${title} – open` : undefined}
      >
        {inner}
      </NextLink>
    );
  }

  return inner;
}
