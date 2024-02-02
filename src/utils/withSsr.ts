import { SESSION_OPTIONS } from '@/configs/session'
import { withIronSessionSsr } from 'iron-session/next'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

type WithSsrHandler<
  P extends {
    [key: string]: unknown
  } = {
    [key: string]: unknown
  },
> = (
  context: GetServerSidePropsContext,
) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>

export default function withSsr(handler: WithSsrHandler) {
  return withIronSessionSsr(async (ctx) => {
    if (ctx.req.method === 'OPTIONS') {
      return {
        props: {},
      }
    }

    return handler(ctx)
  }, SESSION_OPTIONS)
}
