import { getPosts } from "./get-posts";
import PostsClient from "./PostsClient";

export const metadata = {
  title: "Posts",
};

/**
 * Posts index listing with images from MDX front matter.
 *
 * Params:
 * - none: Server component; loads posts and tags.
 */
export default async function PostsPage() {
  const posts = await getPosts();
  const clientPosts = posts.map((post) => {
    const title = post.frontMatter.title ?? post.route;
    const description = post.frontMatter.description;
    const image = post.frontMatter.image;
    let imageSrc;
    if (typeof image === "string") {
      const trimmed = image.trim();
      if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) {
        imageSrc = trimmed;
      } else {
        imageSrc = `${post.route}/${trimmed.replace(/^\.??\//, "")}`;
      }
    } else {
      imageSrc = undefined;
    }
    const tags = Array.isArray(post.frontMatter.tags)
      ? post.frontMatter.tags
      : [];
    return {
      title,
      description,
      imageSrc,
      href: post.route,
      tags,
    };
  });

  return (
    <div data-pagefind-ignore="all">
      <h1>{metadata.title}</h1>
      <PostsClient posts={clientPosts} />
    </div>
  );
}
