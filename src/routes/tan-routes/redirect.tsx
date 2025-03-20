import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/tan-routes/redirect')({
  beforeLoad: async () => {
    throw redirect({
      to: '/posts',
    })
  },
})
