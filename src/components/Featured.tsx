import Card from "@/components/Card"
import { getPosts } from "@/app/posts/get-posts"

export type FeaturedProps = {
  /**
   * Short description: Render selected posts in a fixed order as cards.
   * 
   * Params:
   * - routes: Ordered list of post routes like "/posts/dimension".
   */
  routes: string[]
}

type NextraPost = {
  route: string
  frontMatter: {
    title?: string
    description?: string
    image?: string
    tags?: string[]
  }
}

function buildClientPost(post: NextraPost) {
  const title = post.frontMatter.title ?? post.route
  const description = post.frontMatter.description
  const image = post.frontMatter.image

  let imageSrc: string | undefined
  if (typeof image === "string") {
    const trimmed = image.trim()
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) {
      imageSrc = trimmed
    } else {
      imageSrc = `${post.route}/${trimmed.replace(/^\.??\//, "")}`
    }
  }

  return {
    title,
    description,
    imageSrc,
    href: post.route,
  }
}

/**
 * Server component: renders a responsive grid of featured posts as `Card`s.
 * 
 * Params:
 * - routes: Ordered list of post routes to display.
 * 
 * Returns: JSX markup with a grid of cards.
 */
export default async function Featured({ routes }: FeaturedProps) {
  const posts = (await getPosts()) as NextraPost[]
  const byRoute = new Map<string, NextraPost>(posts.map(p => [p.route, p]))

  const ordered = routes
    .map(route => byRoute.get(route))
    .filter((p): p is NextraPost => Boolean(p))
    .map(buildClientPost)

  return (
    <div>
      <style>{`
        .featuredGrid { display: grid; gap: 16px; grid-template-columns: 1fr; }
        @media (min-width: 1024px) { .featuredGrid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      `}</style>
      <div className="not-prose featuredGrid">
        {ordered.map(post => (
          <Card
            key={post.href}
            title={post.title}
            imageSrc={post.imageSrc}
            imageAlt={post.title}
            href={post.href}
          >
            {post.description ? <p style={{ margin: 0 }}>{post.description}</p> : null}
          </Card>
        ))}
      </div>
    </div>
  )
}


