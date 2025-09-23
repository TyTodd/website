"use client";

import React from "react";

type YouTubeProps = {
  /** The YouTube video ID (e.g., dQw4w9WgXcQ) or full URL. */
  videoId: string;
  /** Optional title for accessibility. */
  title?: string;
  /** Optional aspect ratio, expressed as width/height (e.g., 16/9). */
  aspect?: number;
};

/**
 * Renders a responsive YouTube iframe embed with an accessible title.
 *
 * Params:
 * - videoId: The YouTube video ID (e.g., dQw4w9WgXcQ) or a full URL.
 * - title: Optional accessible title for the iframe.
 * - aspect: Optional aspect ratio as width/height (default 16/9).
 *
 * Returns:
 * - A responsive container with a YouTube iframe.
 */
export default function YouTube({ videoId, title, aspect = 16 / 9 }: YouTubeProps) {
  const extractedId = React.useMemo(() => extractYouTubeId(videoId), [videoId]);
  const paddingTopPercent = `${100 / aspect}%`;
  const iframeTitle = title ?? "YouTube video";

  if (!extractedId) {
    return (
      <div style={{ color: "#b91c1c" }}>
        {/* #CAVEAT: Intentionally minimal runtime error surface area for MDX usage */}
        Invalid YouTube video id or URL.
      </div>
    );
  }

  const src = `https://www.youtube.com/embed/${extractedId}`;

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: paddingTopPercent }}>
      <iframe
        src={src}
        title={iframeTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </div>
  );
}

function extractYouTubeId(input: string): string | null {
  /**
   * Params:
   * - input: A raw YouTube video id or various URL formats.
   *
   * Returns:
   * - The normalized 11-character video id, or null if not parsable.
   */
  // Direct id (common case): keep when 11 chars of typical charset
  const idLike = input.trim();
  const idRegex = /^[a-zA-Z0-9_-]{11}$/;
  if (idRegex.test(idLike)) return idLike;

  try {
    const url = new URL(idLike.startsWith("http") ? idLike : `https://youtu.be/${idLike}`);
    // youtu.be/<id>
    if (url.hostname === "youtu.be") {
      const candidate = url.pathname.replace(/^\//, "");
      return idRegex.test(candidate) ? candidate : null;
    }
    // www.youtube.com/watch?v=<id>
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && idRegex.test(v)) return v;
      // youtube.com/embed/<id>
      const parts = url.pathname.split("/").filter(Boolean);
      const embedIdx = parts.findIndex((p) => p === "embed");
      if (embedIdx >= 0 && parts[embedIdx + 1] && idRegex.test(parts[embedIdx + 1])) {
        return parts[embedIdx + 1];
      }
    }
  } catch {
    // fallthrough
  }
  return null;
}


