"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/Card";

export type FilterablePost = {
  /**
   * Short description: Shape of a post item used by the client filter UI.
   *
   * Params:
   * - title: Display title for the post.
   * - description: Optional short description for the post.
   * - imageSrc: Optional image URL for the post.
   * - href: Route to navigate to for the post.
   * - tags: List of tag strings associated with the post.
   */
  title: string;
  description?: string;
  imageSrc?: string;
  href: string;
  tags: string[];
};

type PostsClientProps = {
  /**
   * Short description: Interactive filter and grid renderer for posts.
   *
   * Params:
   * - posts: Array of filterable post items to render.
   */
  posts: FilterablePost[];
};

/**
 * Renders tag filter buttons and a responsive grid of posts.
 * - Grid: 1 column on mobile, 3 columns on desktop.
 * - Filters: Multi-select; selected state reflected in the URL query `tags`.
 *
 * Params:
 * - posts: Array of filterable post items to render.
 */
export default function PostsClient({ posts }: PostsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allTags = useMemo(() => {
    const tagCount: Record<string, number> = Object.create(null);
    for (const post of posts) {
      for (const tag of post.tags ?? []) {
        tagCount[tag] ??= 0;
        tagCount[tag] += 1;
      }
    }
    return tagCount;
  }, [posts]);

  const initialSelected = useMemo(() => {
    const param = searchParams.get("tags");
    if (!param) return new Set<string>();
    return new Set(
      param
        .split(",")
        .map((t) => decodeURIComponent(t))
        .filter(Boolean)
    );
  }, [searchParams]);

  const [selectedTags, setSelectedTags] =
    useState<Set<string>>(initialSelected);

  useEffect(() => {
    // Sync state if URL changes externally (e.g., back/forward navigation)
    const param = searchParams.get("tags");
    const next = new Set<string>(
      (param ? param.split(",") : [])
        .map((t) => decodeURIComponent(t))
        .filter(Boolean)
    );
    setSelectedTags(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const toggleTag = (tag: string) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setSelectedTags(next);

    const params = new URLSearchParams(searchParams.toString());
    if (next.size === 0) {
      params.delete("tags");
    } else {
      params.set(
        "tags",
        Array.from(next)
          .map((t) => encodeURIComponent(t))
          .join(",")
      );
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredPosts = useMemo(() => {
    if (selectedTags.size === 0) return posts;
    return posts.filter((post) => post.tags?.some((t) => selectedTags.has(t)));
  }, [posts, selectedTags]);

  return (
    <div>
      <div
        className="not-prose"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: ".5rem",
          marginBottom: "1rem",
        }}
      >
        {Object.entries(allTags).map(([tag, count]) => {
          const isSelected = selectedTags.has(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="nextra-tag !bg-transparent !bg-none border border-black/15 dark:border-white/15 shadow-[0_6px_16px_rgba(0,0,0,0.18)] dark:shadow-[0_6px_16px_rgba(255,255,255,0.18)]"
              style={{
                ...(isSelected
                  ? {
                      background: "rgba(59,130,246,0.12)",
                      color: "rgb(37,99,235)",
                    }
                  : {}),
              }}
            >
              {tag} ({count})
            </button>
          );
        })}
      </div>

      <style>{`
        .postsGrid { display: grid; gap: 16px; grid-template-columns: 1fr; }
        @media (min-width: 1024px) { .postsGrid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      `}</style>
      <div className="not-prose postsGrid">
        {filteredPosts.map((post) => (
          <Card
            key={post.href}
            title={post.title}
            imageSrc={post.imageSrc}
            imageAlt={post.title}
            href={post.href}
          >
            {post.description ? (
              <p style={{ margin: 0 }}>{post.description}</p>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
