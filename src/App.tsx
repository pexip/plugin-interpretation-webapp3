import React, { useEffect, useState } from 'react'

import { registerPlugin } from '@pexip/plugin-api'
import { setPlugin } from './plugin'
import { initializeEvents } from './events'
import { initializeButton } from './button'
import { initializeIFrame } from './iframe'
import { LanguageIndicator } from './components/LanguageIndicator/LanguageIndicator'
import { ThemeProvider } from '@pexip/components'
import { Interpretation } from './interpretation'
import type { Language } from './language'

export const App = (): JSX.Element => {
  const [language, setLanguage] = useState<Language | null>(null)

  useEffect(() => {
    let ignore = false

    const bootStrap = async (): Promise<void> => {
      const plugin = await registerPlugin({
        id: 'interpretation',
        version: 0
      })
      setPlugin(plugin)
      initializeEvents()
      if (!ignore) {
        await initializeButton()
      }
      initializeIFrame()
      Interpretation.registerOnChangeLanguageCallback((language) => {
        setLanguage(language)
      })
    }

    bootStrap().catch((e) => { console.error(e) })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <ThemeProvider colorScheme='light'>
      {language != null && <LanguageIndicator languageName={language?.name ?? ''} />}
    </ThemeProvider>
  )
}
