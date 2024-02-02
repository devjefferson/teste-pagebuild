import { AgeGateContent } from './AgeGateContent'
import { BrandContent } from './BrandContent'
import { NavigationContent } from './NavigationContent'

export type SiteSetup = {
  navigation: NavigationContent | undefined
  brand: BrandContent | undefined
  ageGate: AgeGateContent | undefined
}
