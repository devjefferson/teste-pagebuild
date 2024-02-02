/* eslint-disable no-unused-vars */
import { AuthSection } from '@/models/Auth'
import 'iron-session'

declare module 'iron-session' {
  interface IronSessionData {
    ageGate?: 'GRANTED' | 'DENIED'
    auth?: AuthSection
  }
}
