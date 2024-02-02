/* eslint-disable no-useless-catch */
import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import createLogin from './createLogin'
import userData from './me'

// import getMe from '../GetMe'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'text', value: '' },
        password: { label: 'Password', type: 'password', value: '' },
        recaptchaToken: { label: 'Password', type: 'password', value: '' },
      },
      async authorize(credentials) {
        try {
          const login = await createLogin({
            email: credentials?.email || '',
            password: credentials?.password || '',
            recaptchaToken: credentials?.recaptchaToken,
          })

          const user = await userData(login.access_token)
          if (user) return user

          return null
        } catch (error) {
          return null
        }
      },
    }),
    CredentialsProvider({
      id: 'refresh-user',
      name: 'refresh-user',
      credentials: {
        token: { label: 'token', type: 'text', value: '' },
      },
      async authorize(credentials) {
        try {
          const me = await userData(credentials?.token || '')
          if (me) return me
          return null
        } catch (error) {
          return null
        }
      },
    }),
    CredentialsProvider({
      id: 'xeerpa-login',
      name: 'xeerpa-login',
      credentials: {
        recaptchaToken: { label: 'text', type: 'text', value: '' },
        xeerpaToken: { label: 'Xeerpa Token', type: 'text', value: '' },
        email: { label: 'E-mail', type: 'text', value: '' },
      },
      async authorize(credentials) {
        try {
          const login = await createLogin({
            recaptchaToken: credentials?.recaptchaToken,
            xeerpaToken: credentials?.xeerpaToken,
            email: credentials?.email,
          })

          if (login.status === 200) {
            const user = await userData(login.data.access_token)
            if (user) return user
          }

          return null
        } catch (error) {
          return null
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 1, // 1 day
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      const blackList = ['iat', 'exp', 'jti']
      const sanitizedToken = Object.keys(token).reduce((response, item) => {
        if (!blackList.includes(item)) {
          response[item] = token[item]
          return response
        }
        return response
      }, {} as Record<string, any>)
      return { ...session, user: sanitizedToken }
    },
    async jwt({ token, user }) {
      return (user as any) || token
    },
  },
}

export default authOptions
