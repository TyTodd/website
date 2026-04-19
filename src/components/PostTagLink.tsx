"use client";

import Link from "next/link";
import { TagTypeIcon } from "@/components/TagTypeIcon";

export function PostTagLink({ tag }: { tag: string }) {
  return (
    <Link href={`/tags/${tag}`} className="nextra-tag">
      <TagTypeIcon tag={tag} />
      <span>{tag}</span>
    </Link>
  );
}
