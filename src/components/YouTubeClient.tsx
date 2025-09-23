"use client";

import React from "react";
import ReactYouTube from "react-youtube";

export type YouTubeClientProps = React.ComponentProps<typeof ReactYouTube>;

/**
 * Thin client wrapper around `react-youtube` for use in MDX.
 *
 * Params:
 * - All props are forwarded to the underlying `react-youtube` component.
 *
 * Returns:
 * - The `react-youtube` component rendered client-side only.
 */
export default function YouTubeClient(props: YouTubeClientProps) {
  return <ReactYouTube {...props} />;
}


