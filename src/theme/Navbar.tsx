"use client";

import { usePathname } from "next/navigation";
import type { FC, ReactNode } from "react";
import { Children } from "react";
import type { PageMapItem } from "nextra";
import { Anchor } from "nextra/components";
import { normalizePages } from "nextra/normalize-pages";
import LiquidGlass from "liquid-glass-react";

type NavbarProps = {
  /**
   * Short description: Top-level navigation built from Nextra's page map.
   *
   * Params:
   * - pageMap: Array of Nextra page map items to derive top-level links from.
   * - children: Optional right-aligned content (e.g., custom links, theme switch).
   * - leftSlot: Optional left-aligned content (e.g., home icon).
   */
  pageMap: PageMapItem[];
  children?: ReactNode;
  leftSlot?: ReactNode;
};

/**
 * Render a sticky, blurred, semi-transparent navbar with optional left and right slots.
 *
 * Params:
 * - pageMap: Array of Nextra page map items to derive top-level links from.
 * - children: Optional right-aligned content (e.g., links, theme switch).
 * - leftSlot: Optional left-aligned content (e.g., home icon/brand).
 */
const Navbar: FC<NavbarProps> = ({ pageMap, children, leftSlot }) => {
  const pathname = usePathname();
  const { topLevelNavbarItems } = normalizePages({
    list: pageMap,
    route: pathname,
  });

  const normalizedChildren = Children.toArray(children);

  const uniqueNavItems = (() => {
    const seenRoutes = new Set<string>();
    return topLevelNavbarItems
      .map((item) => {
        const route =
          item.route || ("href" in item ? (item.href as string) : "");
        return { route, title: item.title };
      })
      .filter((item) => {
        if (!item.route) return false;
        if (seenRoutes.has(item.route)) return false;
        seenRoutes.add(item.route);
        return true;
      });
  })();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "saturate(180%) blur(12px)",
        WebkitBackdropFilter: "saturate(180%) blur(12px)",
        background: "color-mix(in oklab, #0ea5e9 14%, transparent)",
        border: "1px solid color-mix(in oklab, canvasText 12%, transparent)",
        borderRadius: 12,
        boxShadow:
          "0 2px 10px color-mix(in oklab, canvasText 10%, transparent)",
        maxWidth: 1360,
        margin: "8px auto 0",
        marginBottom: 20,
      }}
      className="not-prose"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1360,
          margin: "0 auto",
          padding: "10px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {leftSlot}
          <ul
            style={{
              display: "flex",
              listStyleType: "none",
              padding: 0,
              margin: 0,
              gap: 16,
            }}
          >
            {uniqueNavItems.map((item, index) => (
              <li key={`${item.route}-${item.title}-${index}`}>
                <Anchor href={item.route} style={{ textDecoration: "none" }}>
                  {item.title}
                </Anchor>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {normalizedChildren}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
