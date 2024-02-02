import { IronSessionOptions } from 'iron-session'

export const SESSION_OPTIONS: IronSessionOptions = {
  cookieName: process.env.COOKIE_NAME || 'dc-page-builder-session',
  password: process.env.SESSION_SECRET_KEY || '',
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 1, // 1 day
    secure: process.env.NODE_ENV === 'production',
  },
}
