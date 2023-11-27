import React, { useEffect, useState } from 'react'

import { registerPlugin } from '@pexip/plugin-api'
import { setPlugin } from './plugin'
import { initializeEvents } from './events'
import { initializeButton, setButtonActive } from './button'
import { initializeIFrame } from './iframe'
import { Widget } from './Widget/Widget'
import { ThemeProvider } from '@pexip/components'
import { Interpretation } from './interpretation/interpretation'
import { config } from './config'
import { Role } from './types/Role'
import type { Language } from './types/Language'
import { MainRoomMuteButtons } from './main-room/mute-buttons'
import { MainRoomVolume } from './main-room/volume'

export const App = (): JSX.Element => {
  const [visible, setVisible] = useState(false)
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

      Interpretation.emitter.on('changed', () => {
        const language = Interpretation.getLanguage()
        if (language != null) {
          // TODO: We should differentiate between a new connection and change the language
          if (config.role === Role.Interpreter) {
            MainRoomMuteButtons.mute(true)
          } else {
            MainRoomVolume.set(0.1)
          }
        } else {
          if (config.role === Role.Listener) {
            MainRoomVolume.set(1)
          }
          plugin.ui.showToast({ message: 'Left interpretation room' }).catch((e) => { console.error(e) })
        }
        setButtonActive(language != null).catch((e) => { console.error(e) })
        setLanguage(language)
        setVisible(true)
      })
      Interpretation.emitter.on('minimized', (minimized: boolean) => {
        setVisible(!minimized)
      })
    }
    bootStrap().catch((e) => { console.error(e) })
  }, [])

  return (
    <ThemeProvider colorScheme='light'>
      {language != null && visible &&
        <Widget
          defaultLanguage={language}
          role={config.role}
          allowChangeDirection={config.allowChangeDirection}
          onMinimize={() => { setVisible(false) }}
        />}
    </ThemeProvider>
  )
}
