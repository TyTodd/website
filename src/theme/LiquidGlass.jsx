"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

/**
 * @typedef {Object} LiquidGlassProps
 * @property {import('react').ReactNode} [children]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {number} [borderRadius]
 * @property {string} [backgroundLight]
 * @property {string} [backgroundDark]
 * @property {string} [borderColorLight]
 * @property {string} [borderColorDark]
 * @property {string} [boxShadow]
 * @property {boolean} [icons]
 * @property {boolean} [dockBoost]
 * @property {"dock"|"pill"|"bubble"|"free"} [preset]
 * @property {number} [width]
 * @property {number} [height]
 * @property {number} [frost]
 * @property {number} [saturation]
 * @property {number} [displace]
 * @property {number} [blur]
 * @property {number} [lightness]
 * @property {number} [alpha]
 * @property {number} [border]
 * @property {number} [scale]
 * @property {number} [r]
 * @property {number} [g]
 * @property {number} [b]
 * @property {"R"|"G"|"B"} [x]
 * @property {"R"|"G"|"B"} [y]
 * @property {string} [blend]
 */

/**
 * LiquidGlass component
 *
 * Provides a configurable liquid glass/backdrop displacement effect and renders children inside.
 * Based on the demo implementation in `src/app/liquid/page.jsx`, but scoped for component usage
 * and controllable entirely via props instead of a debug UI.
 *
 * @param {LiquidGlassProps} [props]
 */
export default function LiquidGlass({
  // Layout and appearance
  className,
  style,
  children,
  borderRadius = 12,
  backgroundLight = "hsl(0 0% 100% / var(--frost, 0))",
  backgroundDark = "hsl(0 0% 0% / var(--frost, 0))",
  borderColorLight = "color-mix(in oklch, canvasText, #0000 85%)",
  borderColorDark = "color-mix(in oklch, canvasText, #0000 65%)",
  boxShadow = "0px 4px 16px rgba(17, 17, 26, 0.05), 0px 8px 24px rgba(17, 17, 26, 0.05), 0px 16px 56px rgba(17, 17, 26, 0.05)",
  /** When true, render the demo icon grid (off for production use like Navbar) */
  icons = false,
  /** Enables an extra brightness bump akin to demo's `data-mode="dock"` */
  dockBoost = true,

  // Displacement configuration
  preset = "dock", // 'dock' | 'pill' | 'bubble' | 'free'
  width, // optional: when omitted, measured from content
  height, // optional: when omitted, measured from content
  frost = 0.05,
  saturation = 1.5,
  displace = 0.2, // output blur in the filter chain
  blur = 11, // blur for the inner highlight in displacement image
  lightness = 50, // highlight lightness
  alpha = 0.93, // highlight alpha
  border = 0.07, // relative border for the inner highlight
  scale = -180, // base displacement scale
  r = 0, // chromatic offset
  g = 10,
  b = 20,
  x = "R", // channel X selector: 'R' | 'G' | 'B'
  y = "B", // channel Y selector: 'R' | 'G' | 'B'
  blend = "difference", // mix-blend-mode for red/blue gradient overlays in displacement image
} = {}) {
  const containerRef = useRef(null);
  const feImageRef = useRef(null);
  const feBlurRef = useRef(null);
  const feRedRef = useRef(null);
  const feGreenRef = useRef(null);
  const feBlueRef = useRef(null);
  const filterId = useId().replace(/:/g, "");

  // Merge preset defaults
  const merged = useMemo(() => {
    const base = {
      borderRadius,
      frost,
      saturation,
      displace,
      blur,
      lightness,
      alpha,
      border,
      scale,
      r,
      g,
      b,
      x,
      y,
      blend,
      icons,
    };
    const presets = {
      dock: { width: 336, height: 96, displace: 0.2, icons: true, frost: 0.05 },
      pill: { width: 200, height: 80, displace: 0, frost: 0, borderRadius: 40 },
      bubble: {
        width: 140,
        height: 140,
        displace: 0,
        frost: 0,
        borderRadius: 70,
      },
      free: {
        width: 140,
        height: 280,
        border: 0.15,
        alpha: 0.74,
        lightness: 60,
        blur: 10,
        displace: 0,
        scale: -300,
        borderRadius: 80,
      },
    };
    const presetVals = presets[preset] || {};
    return {
      ...base,
      width: width ?? presetVals.width,
      height: height ?? presetVals.height,
      frost: frost ?? presetVals.frost ?? base.frost,
      displace: displace ?? presetVals.displace ?? base.displace,
      borderRadius:
        borderRadius ?? presetVals.borderRadius ?? base.borderRadius,
      icons: icons ?? presetVals.icons ?? base.icons,
    };
  }, [
    alpha,
    b,
    blend,
    border,
    borderRadius,
    frost,
    g,
    height,
    icons,
    lightness,
    preset,
    r,
    saturation,
    scale,
    displace,
    blur,
    width,
    x,
    y,
  ]);

  // Track measured size for auto width/height
  const [measured, setMeasured] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      setMeasured({
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
      });
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const effectiveWidth = merged.width || measured.width || 300;
  const effectiveHeight = merged.height || measured.height || 80;

  // Build the displacement image as a data URI whenever relevant props change
  useEffect(() => {
    if (!feImageRef.current) return;
    const borderPx =
      Math.min(effectiveWidth, effectiveHeight) * (merged.border * 0.5);
    const svg = `\
<svg class="displacement-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${effectiveWidth} ${effectiveHeight}">\
  <defs>\
    <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">\
      <stop offset="0%" stop-color="#000"/>\
      <stop offset="100%" stop-color="red"/>\
    </linearGradient>\
    <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">\
      <stop offset="0%" stop-color="#000"/>\
      <stop offset="100%" stop-color="blue"/>\
    </linearGradient>\
  </defs>\
  <rect x="0" y="0" width="${effectiveWidth}" height="${effectiveHeight}" fill="black"/>\
  <rect x="0" y="0" width="${effectiveWidth}" height="${effectiveHeight}" rx="${
      merged.borderRadius
    }" fill="url(#red)"/>\
  <rect x="0" y="0" width="${effectiveWidth}" height="${effectiveHeight}" rx="${
      merged.borderRadius
    }" fill="url(#blue)" style="mix-blend-mode: ${merged.blend}"/>\
  <rect \
    x="${borderPx}" \
    y="${borderPx}" \
    width="${effectiveWidth - borderPx * 2}" \
    height="${effectiveHeight - borderPx * 2}" \
    rx="${merged.borderRadius}" \
    fill="hsl(0 0% ${merged.lightness}% / ${merged.alpha})" \
    style="filter:blur(${merged.blur}px)"/>\
</svg>`;

    const encoded = encodeURIComponent(svg);
    const dataUri = `data:image/svg+xml,${encoded}`;
    const img = feImageRef.current;
    try {
      img.setAttribute("href", dataUri);
      img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", dataUri);
    } catch {}

    // Channel selectors
    if (feRedRef.current) {
      feRedRef.current.setAttribute("xChannelSelector", merged.x);
      feRedRef.current.setAttribute("yChannelSelector", merged.y);
      feRedRef.current.setAttribute("scale", String(merged.scale + merged.r));
    }
    if (feGreenRef.current) {
      feGreenRef.current.setAttribute("xChannelSelector", merged.x);
      feGreenRef.current.setAttribute("yChannelSelector", merged.y);
      feGreenRef.current.setAttribute("scale", String(merged.scale + merged.g));
    }
    if (feBlueRef.current) {
      feBlueRef.current.setAttribute("xChannelSelector", merged.x);
      feBlueRef.current.setAttribute("yChannelSelector", merged.y);
      feBlueRef.current.setAttribute("scale", String(merged.scale + merged.b));
    }
    if (feBlurRef.current) {
      feBlurRef.current.setAttribute("stdDeviation", String(merged.displace));
    }
  }, [
    merged.alpha,
    merged.b,
    merged.blend,
    merged.border,
    merged.borderRadius,
    merged.blur,
    merged.g,
    merged.lightness,
    merged.r,
    merged.scale,
    merged.displace,
    merged.x,
    merged.y,
    effectiveWidth,
    effectiveHeight,
  ]);

  const containerStyle = useMemo(() => {
    // Background and border hues adapt to theme using light-dark()
    const filterString = `url(#${filterId}) ${
      dockBoost ? "brightness(1.1)" : ""
    } saturate(${merged.saturation})`.trim();
    return {
      "--frost": String(merged.frost),
      "--saturation": String(merged.saturation),
      borderRadius: merged.borderRadius,
      background: `light-dark(${backgroundLight}, ${backgroundDark})`,
      backdropFilter: filterString,
      WebkitBackdropFilter: filterString,
      boxShadow: `0 0 2px 1px light-dark(${borderColorLight}, ${borderColorDark}) inset, ${boxShadow}`,
      ...style,
    };
  }, [
    backgroundDark,
    backgroundLight,
    borderColorDark,
    borderColorLight,
    boxShadow,
    dockBoost,
    filterId,
    merged.borderRadius,
    merged.frost,
    merged.saturation,
    style,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
      data-icons={String(merged.icons)}
    >
      {/* Content slot */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      {/* Scoped filter for displacement */}
      <svg
        className="liquid-filter"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: 0, height: 0 }}
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feImage
              ref={feImageRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              result="map"
            />

            <feDisplacementMap
              ref={feRedRef}
              in="SourceGraphic"
              in2="map"
              id={`red-${filterId}`}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispRed"
            />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />

            <feDisplacementMap
              ref={feGreenRef}
              in="SourceGraphic"
              in2="map"
              id={`green-${filterId}`}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />

            <feDisplacementMap
              ref={feBlueRef}
              in="SourceGraphic"
              in2="map"
              id={`blue-${filterId}`}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispBlue"
            />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={feBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
