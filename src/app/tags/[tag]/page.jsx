import { getPosts, getTags } from '../../posts/get-posts'
import Card from '@/components/Card'
 
export async function generateMetadata(props) {
  const params = await props.params
  return {
    title: `Posts Tagged with “${decodeURIComponent(params.tag)}”`
  }
}
 
export async function generateStaticParams() {
  const allTags = await getTags()
  return [...new Set(allTags)].map(tag => ({ tag }))
}
 
export default async function TagPage(props) {
  const params = await props.params
  const { title } = await generateMetadata({ params })
  const posts = await getPosts()
  return (
    <>
      <h1>{title}</h1>
      {posts
        .filter(post =>
          post.frontMatter.tags.includes(decodeURIComponent(params.tag))
        )
        .map(post => {
          const postTitle = post.frontMatter.title ?? post.route
          const description = post.frontMatter.description
          const image = post.frontMatter.image
          const imageSrc = typeof image === 'string'
            ? `${post.route}/${image.replace(/^\.\//, '')}`
            : undefined
          return (
            <Card
              key={post.route}
              title={postTitle}
              imageSrc={imageSrc}
              imageAlt={postTitle}
              href={post.route}
            >
              {description ? <p style={{ margin: 0 }}>{description}</p> : null}
            </Card>
          )
        })}
    </>
  )
}