import { AuthSection } from '@/models/Auth'
import { SiteSetup } from '@/models/SiteSetup'
import React, { createContext, useContext, useMemo, useState } from 'react'

type AppContextProps = {
  siteSetup: SiteSetup
  authSection?: AuthSection
  ageGateSection?: string
  setAuthSection: (authSection?: AuthSection) => void
}

const AppContext = createContext<AppContextProps>({} as AppContextProps)

type AppProviderProps = {
  siteSetup: SiteSetup
  children: React.ReactNode
  authSection?: AuthSection
  ageGateSection?: string
}

export default function AppProvider({
  siteSetup,
  children,
  authSection: defaultAuthSection,
  ageGateSection,
}: AppProviderProps) {
  const [authSection, setAuthSection] = useState(defaultAuthSection)
  const value = useMemo<AppContextProps>(() => {
    return {
      siteSetup,
      authSection,
      setAuthSection,
      ageGateSection,
    }
  }, [authSection, siteSetup, ageGateSection])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
