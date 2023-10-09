import React, { useEffect, useState } from 'react'

import { registerPlugin } from '@pexip/plugin-api'
import { setPlugin } from './plugin'
import { initializeEvents } from './events'
import { initializeButton, setButtonActive } from './button'
import { initializeIFrame } from './iframe'
import { LanguagePanel } from './components/LanguagePanel/LanguagePanel'
import { ThemeProvider } from '@pexip/components'
import { Interpretation } from './interpretation'
import type { Language } from './language'
import { setMainRoomVolume, muteMainRoomAudio } from './main-room'
import { config } from './config'
import { Role } from './types/Role'

export const App = (): JSX.Element => {
  const [language, setLanguage] = useState<Language | null>(null)

  useEffect(() => {
    const bootStrap = async (): Promise<void> => {
      const plugin = await registerPlugin({
        id: 'interpretation',
        version: 0
      })

      setPlugin(plugin)
      initializeEvents()
      await initializeButton()
      initializeIFrame()

      Interpretation.registerOnChangeLanguageCallback((language) => {
        if (language != null) {
          if (config.role === Role.Interpreter) {
            muteMainRoomAudio()
          } else {
            setMainRoomVolume(0.1)
          }
        } else {
          if (config.role === Role.Listener) {
            setMainRoomVolume(1)
          }
          plugin.ui.showToast({ message: 'Left interpretation room' }).catch((e) => { console.error(e) })
        }
        setButtonActive(language != null).catch((e) => { console.error(e) })
        setLanguage(language)
      })
    }
    bootStrap().catch((e) => { console.error(e) })
  }, [])

  return (
    <ThemeProvider colorScheme='light'>
      {language != null &&
        <LanguagePanel
          defaultLanguage={language}
          role={config.role}
        />}
    </ThemeProvider>
  )
}
