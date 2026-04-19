"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Chip,
  EmptyState,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import type { Key, Selection } from "@react-types/shared";
import Card from "@/components/Card";
import { TagTypeIcon } from "@/components/TagTypeIcon";

const PROJECT_TAG = "project";

export type FilterablePost = {
  title: string;
  description?: string;
  imageSrc?: string;
  href: string;
  tags: string[];
};

type PostsView = "blog" | "projects";

type PostsClientProps = {
  posts: FilterablePost[];
  pageTitle: string;
};

function parseTagsParam(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => decodeURIComponent(t.trim()))
    .filter(Boolean)
    .filter((t) => t !== PROJECT_TAG);
}

function parseView(sp: URLSearchParams): PostsView {
  const v = sp.get("view");
  if (v === "blog") return "blog";
  return "projects";
}

function postMatchesView(post: FilterablePost, view: PostsView): boolean {
  const hasProject = (post.tags ?? []).includes(PROJECT_TAG);
  return view === "projects" ? hasProject : !hasProject;
}

export default function PostsClient({ posts, pageTitle }: PostsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const migratedLegacy = useRef(false);

  const view = useMemo(() => parseView(searchParams), [searchParams]);

  const basePosts = useMemo(
    () => posts.filter((p) => postMatchesView(p, view)),
    [posts, view]
  );

  const allTags = useMemo(() => {
    const counts: Record<string, number> = Object.create(null);
    for (const post of basePosts) {
      for (const tag of post.tags ?? []) {
        if (tag === PROJECT_TAG) continue;
        counts[tag] ??= 0;
        counts[tag] += 1;
      }
    }
    return counts;
  }, [basePosts]);

  const selectedTags = useMemo(() => {
    const fromUrl = parseTagsParam(searchParams.get("tags"));
    return new Set(fromUrl.filter((t) => allTags[t] !== undefined));
  }, [searchParams, allTags]);

  useEffect(() => {
    if (migratedLegacy.current) return;
    const raw = searchParams.get("tags");
    if (!raw) return;
    const parts = raw
      .split(",")
      .map((t) => decodeURIComponent(t.trim()))
      .filter(Boolean);
    const nonProject = parts.filter((t) => t !== PROJECT_TAG);
    const onlyProject = parts.length > 0 && nonProject.length === 0;
    if (!onlyProject) return;

    migratedLegacy.current = true;
    const next = new URLSearchParams(searchParams.toString());
    next.delete("tags");
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const fromUrl = parseTagsParam(searchParams.get("tags"));
    const valid = fromUrl.filter((t) => allTags[t] !== undefined);
    if (valid.length === fromUrl.length) return;

    const params = new URLSearchParams(searchParams.toString());
    if (valid.length === 0) params.delete("tags");
    else
      params.set(
        "tags",
        valid.map((t) => encodeURIComponent(t)).join(",")
      );
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [allTags, pathname, router, searchParams]);

  const setView = (next: PostsView) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "blog") params.set("view", "blog");
    else params.delete("view");

    const nextBase = posts.filter((p) => postMatchesView(p, next));
    const allowed = new Set<string>();
    for (const post of nextBase) {
      for (const tag of post.tags ?? []) {
        if (tag !== PROJECT_TAG) allowed.add(tag);
      }
    }
    const fromUrl = parseTagsParam(params.get("tags"));
    const kept = fromUrl.filter((t) => allowed.has(t));
    if (kept.length === 0) params.delete("tags");
    else
      params.set(
        "tags",
        kept.map((t) => encodeURIComponent(t)).join(",")
      );

    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const onViewSelectionChange = (keys: Selection) => {
    if (keys === "all") return;
    const first = keys.values().next().value;
    if (first === "blog") setView("blog");
    else if (first === "projects") setView("projects");
  };

  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = new Set(parseTagsParam(params.get("tags")));
    if (current.has(tag)) current.delete(tag);
    else current.add(tag);
    if (current.size === 0) params.delete("tags");
    else
      params.set(
        "tags",
        [...current].map((t) => encodeURIComponent(t)).join(",")
      );
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const filteredPosts = useMemo(() => {
    if (selectedTags.size === 0) return basePosts;
    return basePosts.filter((post) =>
      post.tags?.some((t) => selectedTags.has(t))
    );
  }, [basePosts, selectedTags]);

  const viewKeys = useMemo(() => new Set<Key>([view]), [view]);

  return (
    <div className="not-prose">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-semibold tracking-tight">
          {pageTitle}
        </h1>
        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={viewKeys}
          onSelectionChange={onViewSelectionChange}
          size="sm"
          className="shrink-0"
        >
          <ToggleButton id="blog">Blog</ToggleButton>
          <ToggleButton id="projects">Projects</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(allTags).map(([tag, count]) => {
          const isSelected = selectedTags.has(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="cursor-pointer rounded-full border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <Chip
                color={isSelected ? "accent" : "default"}
                size="sm"
                variant={isSelected ? "primary" : "secondary"}
                className="gap-1"
              >
                <TagTypeIcon tag={tag} />
                <Chip.Label>
                  {tag} ({count})
                </Chip.Label>
              </Chip>
            </button>
          );
        })}
      </div>

      <style>{`
        .postsGrid { display: grid; gap: 16px; grid-template-columns: 1fr; }
        @media (min-width: 1024px) { .postsGrid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      `}</style>

      {basePosts.length === 0 ? (
        <EmptyState className="rounded-2xl border border-dashed border-black/20 py-12 text-center dark:border-white/20">
          <p className="m-0 text-base font-medium text-foreground">
            {view === "blog"
              ? "Blog posts coming soon!"
              : "No project posts match this view."}
          </p>
          {view === "projects" && (
            <p className="m-0 mt-2">
              Posts with the “project” tag appear in Projects.
            </p>
          )}
        </EmptyState>
      ) : filteredPosts.length === 0 ? (
        <EmptyState className="rounded-2xl border border-dashed border-black/20 py-10 text-center dark:border-white/20">
          No posts match the selected tags.
        </EmptyState>
      ) : (
        <div className="postsGrid">
          {filteredPosts.map((post) => (
            <Card
              key={post.href}
              title={post.title}
              imageSrc={post.imageSrc}
              imageAlt={post.title}
              href={post.href}
            >
              {post.description ? (
                <p className="m-0">{post.description}</p>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
