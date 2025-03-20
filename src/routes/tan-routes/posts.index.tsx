import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tan-routes/posts/')({
  component: PostsIndexComponent,
})

function PostsIndexComponent() {
  return <div>Select a post.</div>
}
