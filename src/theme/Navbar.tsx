"use client";

import { usePathname } from "next/navigation";
import type { FC, ReactNode, CSSProperties } from "react";
import { Children, useMemo, useRef, useEffect, useState } from "react";
import type { PageMapItem } from "nextra";
import { Anchor } from "nextra/components";
import { normalizePages } from "nextra/normalize-pages";
import { gsap } from "gsap";

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

  // Liquid glass effect props
  theme?: "system" | "light" | "dark";
  preset?: "navbar" | "compact" | "pill";
  // Visual effect overrides
  width?: number;
  height?: number;
  radius?: number;
  border?: number;
  lightness?: number;
  alpha?: number;
  inputBlur?: number;
  displace?: number;
  scale?: number;
  r?: number;
  g?: number;
  b?: number;
  x?: "R" | "G" | "B";
  y?: "R" | "G" | "B";
  blend?: string;
  saturation?: number;
  brightness?: number;
  frost?: number;

  // Animation props
  animationDuration?: number;
  animationDelay?: number;
  disableAnimation?: boolean;
};

// Base config for the liquid glass effect
const BASE = {
  scale: -180,
  radius: 30,
  border: 0.07,
  lightness: 50,
  displace: 0.2,
  blend: "difference",
  x: "R" as const,
  y: "B" as const,
  alpha: 0.93,
  blur: 11,
  r: 0,
  g: 10,
  b: 20,
  saturation: 1.5,
  brightness: 1.1,
  frost: 0.3,
};

const PRESETS = {
  navbar: { ...BASE, width: 920, height: 56 },
  compact: { ...BASE, width: 800, height: 48, radius: 24 },
  pill: { ...BASE, width: 600, height: 40, radius: 20 },
};

/**
 * Render a sticky, liquid glass navbar with optional left and right slots.
 */
const Navbar: FC<NavbarProps> = ({
  pageMap,
  children,
  leftSlot,
  theme = "system",
  preset = "navbar",
  // Visual effect overrides
  width,
  height,
  radius,
  border,
  lightness,
  alpha,
  inputBlur,
  displace,
  scale,
  r,
  g,
  b,
  x,
  y,
  blend,
  saturation,
  brightness,
  frost,
  // Animation props
  animationDuration = 1.2,
  animationDelay = 0.1,
  disableAnimation = false,
}) => {
  const pathname = usePathname();
  const { topLevelNavbarItems } = normalizePages({
    list: pageMap,
    route: pathname,
  });

  const normalizedChildren = Children.toArray(children);

  // Resolve final config from preset + explicit props
  const config = useMemo(() => {
    const p = PRESETS[preset] || PRESETS.navbar;
    return {
      ...p,
      width: width ?? p.width,
      height: height ?? p.height,
      radius: radius ?? p.radius,
      border: border ?? p.border,
      lightness: lightness ?? p.lightness,
      alpha: alpha ?? p.alpha,
      blur: inputBlur ?? p.blur,
      displace: displace ?? p.displace,
      scale: scale ?? p.scale,
      r: r ?? p.r,
      g: g ?? p.g,
      b: b ?? p.b,
      x: x ?? p.x,
      y: y ?? p.y,
      blend: blend ?? p.blend,
      saturation: saturation ?? p.saturation,
      brightness: brightness ?? p.brightness,
      frost: frost ?? p.frost,
    };
  }, [
    preset,
    width,
    height,
    radius,
    border,
    lightness,
    alpha,
    inputBlur,
    displace,
    scale,
    r,
    g,
    b,
    x,
    y,
    blend,
    saturation,
    brightness,
    frost,
  ]);

  // Generate displacement image data URI
  const displacementImageUri = useMemo(() => {
    const borderPx =
      Math.min(config.width, config.height) * (config.border * 0.5);
    const svgContent = `
      <svg viewBox="0 0 ${config.width} ${
      config.height
    }" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lgnav-red" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="lgnav-blue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${config.width}" height="${
      config.height
    }" fill="black" />
        <rect x="0" y="0" width="${config.width}" height="${
      config.height
    }" rx="${config.radius}" fill="url(#lgnav-red)" />
        <rect x="0" y="0" width="${config.width}" height="${
      config.height
    }" rx="${config.radius}" fill="url(#lgnav-blue)" style="mix-blend-mode: ${
      config.blend
    }" />
        <rect x="${borderPx}" y="${
      Math.min(config.width, config.height) * (config.border * 0.5)
    }" width="${config.width - borderPx * 2}" height="${
      config.height - borderPx * 2
    }" rx="${config.radius}" fill="hsl(0 0% ${config.lightness}% / ${
      config.alpha
    })" style="filter:blur(${config.blur}px)" />
      </svg>`;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  }, [config]);

  // Ref to track if effect is already initialized
  const effectInitialized = useRef(false);
  const navbarRef = useRef<HTMLElement>(null);
  const [isEffectReady, setIsEffectReady] = useState(false);

  // Initialize liquid glass effect and entrance animation
  useEffect(() => {
    if (effectInitialized.current) return;
    effectInitialized.current = true;

    const root = document.documentElement;
    root.dataset.theme = String(theme);

    // Set initial animation state if not disabled
    if (!disableAnimation && navbarRef.current) {
      gsap.set(navbarRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
      });

      // Set initial state for nav items
      gsap.set(".lgnav__nav-link", {
        opacity: 0,
        y: -10,
      });

      gsap.set(".lgnav__left-slot > *", {
        opacity: 0,
        x: -15,
      });

      gsap.set(".lgnav__right-slot > *", {
        opacity: 0,
        x: 15,
      });
    }

    // Build displacement image SVG and feed it to <feImage/>
    const initializeEffect = () => {
      const debugEl = document.querySelector(".lgnav__displacement-debug");
      if (!debugEl) {
        // Retry after a short delay if element not found
        setTimeout(initializeEffect, 100);
        return;
      }

      const borderPx =
        Math.min(config.width, config.height) * (config.border * 0.5);
      const kids = `
        <svg class="lgnav__displacement-image" viewBox="0 0 ${config.width} ${
        config.height
      }" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lgnav-red" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#000"/>
              <stop offset="100%" stop-color="red"/>
            </linearGradient>
            <linearGradient id="lgnav-blue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#000"/>
              <stop offset="100%" stop-color="blue"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="${config.width}" height="${
        config.height
      }" fill="black" />
          <rect x="0" y="0" width="${config.width}" height="${
        config.height
      }" rx="${config.radius}" fill="url(#lgnav-red)" />
          <rect x="0" y="0" width="${config.width}" height="${
        config.height
      }" rx="${config.radius}" fill="url(#lgnav-blue)" style="mix-blend-mode: ${
        config.blend
      }" />
          <rect x="${borderPx}" y="${
        Math.min(config.width, config.height) * (config.border * 0.5)
      }" width="${config.width - borderPx * 2}" height="${
        config.height - borderPx * 2
      }" rx="${config.radius}" fill="hsl(0 0% ${config.lightness}% / ${
        config.alpha
      })" style="filter:blur(${config.blur}px)" />
        </svg>`;

      debugEl.innerHTML = kids;
      const svgEl = debugEl.querySelector(".lgnav__displacement-image");
      if (!svgEl) return;

      const serialized = new XMLSerializer().serializeToString(svgEl);
      const encoded = encodeURIComponent(serialized);
      const dataUri = `data:image/svg+xml,${encoded}`;

      // Use actual GSAP
      gsap.set("feImage.lgnav__fe-image", { attr: { href: dataUri } });
      gsap.set("feDisplacementMap", {
        attr: { xChannelSelector: config.x, yChannelSelector: config.y },
      });

      // Set styles with GSAP
      gsap.set(root, {
        "--lgnav-width": config.width,
        "--lgnav-height": config.height,
        "--lgnav-radius": config.radius,
        "--lgnav-frost": config.frost,
        "--lgnav-saturation": config.saturation,
        "--lgnav-brightness": config.brightness,
      });
      gsap.set("feDisplacementMap", { attr: { scale: config.scale } });
      gsap.set("#lgnav-redchannel", {
        attr: { scale: config.scale + config.r },
      });
      gsap.set("#lgnav-greenchannel", {
        attr: { scale: config.scale + config.g },
      });
      gsap.set("#lgnav-bluechannel", {
        attr: { scale: config.scale + config.b },
      });
      gsap.set("feGaussianBlur.lgnav__blur", {
        attr: { stdDeviation: config.displace },
      });

      // Start entrance animation after effect is initialized
      if (!disableAnimation && navbarRef.current) {
        const tl = gsap.timeline({ delay: animationDelay });

        // Main navbar entrance
        tl.to(navbarRef.current, {
          duration: animationDuration * 0.6,
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "back.out(1.2)",
        });

        // Left slot items
        tl.to(
          ".lgnav__left-slot > *",
          {
            duration: animationDuration * 0.4,
            opacity: 1,
            x: 0,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.4"
        );

        // Nav links with stagger
        tl.to(
          ".lgnav__nav-link",
          {
            duration: animationDuration * 0.4,
            opacity: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.3"
        );

        // Right slot items
        tl.to(
          ".lgnav__right-slot > *",
          {
            duration: animationDuration * 0.4,
            opacity: 1,
            x: 0,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.4"
        );
      }

      // Mark effect as ready
      setIsEffectReady(true);
    };

    initializeEffect();
  }, []); // Empty dependency array - only run once on mount

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
      ref={navbarRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        maxWidth: config.width,
        margin: "0 auto",
        marginBottom: 16,
        padding: 0,
      }}
      className="not-prose lgnav__navbar"
    >
      <div className="lgnav__effect">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "8px 24px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="lgnav__left-slot">{leftSlot}</div>
            <ul
              style={{
                display: "flex",
                listStyleType: "none",
                padding: 0,
                margin: 0,
                gap: 24,
              }}
            >
              {uniqueNavItems.map((item, index) => (
                <li key={`${item.route}-${item.title}-${index}`}>
                  <Anchor
                    href={item.route}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontWeight: pathname === item.route ? 600 : 500,
                      opacity: pathname === item.route ? 1 : 0.8,
                      transition: "all 0.2s ease",
                    }}
                    className="lgnav__nav-link lgnav__chip"
                  >
                    {item.title}
                  </Anchor>
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: 12 }}
            className="lgnav__right-slot"
          >
            {normalizedChildren}
          </div>
        </div>

        {/* Filter SVG with direct attribute values */}
        <svg className="lgnav__filter" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="lgnav-filter" colorInterpolationFilters="sRGB">
              <feImage
                className="lgnav__fe-image"
                x="0"
                y="0"
                width="100%"
                height="100%"
                result="map"
                href={displacementImageUri}
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                id="lgnav-redchannel"
                xChannelSelector={config.x}
                yChannelSelector="G"
                result="dispRed"
                scale={config.scale + config.r}
              />
              <feColorMatrix
                in="dispRed"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="red"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                id="lgnav-greenchannel"
                xChannelSelector={config.x}
                yChannelSelector="G"
                result="dispGreen"
                scale={config.scale + config.g}
              />
              <feColorMatrix
                in="dispGreen"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="green"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                id="lgnav-bluechannel"
                xChannelSelector={config.x}
                yChannelSelector="G"
                result="dispBlue"
                scale={config.scale + config.b}
              />
              <feColorMatrix
                in="dispBlue"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="blue"
              />
              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" result="output" />
              <feGaussianBlur
                className="lgnav__blur"
                in="output"
                stdDeviation={config.displace}
              />
            </filter>
          </defs>
        </svg>

        {/* Displacement debug element */}
        <div className="lgnav__displacement-debug"></div>
      </div>

      <style jsx global>{`
        :root {
          --lgnav-width: ${config.width};
          --lgnav-height: ${config.height};
          --lgnav-radius: ${config.radius};
          --lgnav-frost: ${config.frost};
          --lgnav-saturation: ${config.saturation};
          --lgnav-brightness: ${config.brightness};
        }

        html {
          color-scheme: light dark;
        }

        [data-theme="light"] {
          color-scheme: light only;
        }
        [data-theme="dark"] {
          color-scheme: dark only;
        }

        .lgnav__navbar {
          position: relative;
        }

        .lgnav__effect {
          position: relative;
          width: calc(var(--lgnav-width) * 1px);
          height: calc(var(--lgnav-height) * 1px);
          border-radius: calc(var(--lgnav-radius) * 1px);
          background: light-dark(
            hsl(146 65% 60% / var(--lgnav-frost)),
            hsl(146 50% 22% / var(--lgnav-frost))
          );
          backdrop-filter: url(#lgnav-filter)
            brightness(var(--lgnav-brightness))
            saturate(var(--lgnav-saturation));
          box-shadow: 0 0 2px 1px
              light-dark(
                color-mix(in oklch, canvasText, transparent 85%),
                color-mix(in oklch, canvasText, transparent 65%)
              )
              inset,
            0 0 10px 4px
              light-dark(
                color-mix(in oklch, canvasText, transparent 90%),
                color-mix(in oklch, canvasText, transparent 85%)
              )
              inset,
            0px 4px 16px rgba(17, 17, 26, 0.05),
            0px 8px 24px rgba(17, 17, 26, 0.05),
            0px 16px 56px rgba(17, 17, 26, 0.05);
          transition: all 0.3s ease;
        }

        .lgnav__nav-link:hover {
          opacity: 1 !important;
          transform: translateY(-1px);
        }
        .lgnav__chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 9999px;
          background: hsl(0 0% 100% / 0.8);
          border: 1px solid color-mix(in oklch, canvasText, transparent 90%);
          backdrop-filter: blur(16px) saturate(1.05);
          -webkit-backdrop-filter: blur(16px) saturate(1.05);
          box-shadow: 0 1px 0 color-mix(in oklch, canvasText, transparent 92%)
            inset;
        }

        .lgnav__chip:hover {
          background: hsl(0 0% 100% / 0.22);
        }

        /* Dark theme overrides (ThemeProvider sets .dark on <html>) */
        .dark .lgnav__chip {
          background: hsl(0 0% 6% / 0.8);
          border-color: color-mix(in oklch, canvasText, transparent 85%);
          box-shadow: 0 1px 0 color-mix(in oklch, canvasText, transparent 88%)
            inset;
        }

        .dark .lgnav__chip:hover {
          background: hsl(0 0% 8% / 0.6);
        }

        .lgnav__filter {
          width: 100%;
          height: 100%;
          pointer-events: none;
          position: absolute;
          inset: 0;
        }

        .lgnav__displacement-debug {
          pointer-events: none;
          height: 100%;
          width: 100%;
          position: absolute;
          inset: 0;
          opacity: 0;
          z-index: -1;
        }

        .lgnav__displacement-image {
          height: 100%;
          width: 100%;
          border-radius: calc(var(--lgnav-radius) * 1px);
        }

        /* Responsive adjustments */
        @media (max-width: 920px) {
          .lgnav__effect {
            width: 95vw;
            max-width: calc(var(--lgnav-width) * 1px);
          }
        }

        @media (max-width: 768px) {
          .lgnav__effect > div {
            padding: 8px 16px !important;
          }

          .lgnav__effect ul {
            gap: 16px !important;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .lgnav__navbar {
            opacity: 1 !important;
            transform: none !important;
          }

          .lgnav__nav-link,
          .lgnav__left-slot > *,
          .lgnav__right-slot > * {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
