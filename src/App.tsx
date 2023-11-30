import React, { useEffect } from 'react'

import { registerPlugin } from '@pexip/plugin-api'
import { setPlugin } from './plugin'
import { initializeEvents, refreshContextEvents } from './events'
import { initializeButton, refreshContextButton } from './button'
import { initializeIFrame } from './iframe'
import { Widget } from './Widget/Widget'
import { useInterpretationContext } from './InterpretationContext/InterpretationContext'
import { refreshContextForms } from './forms'
import { refreshContextPrompts } from './prompts'

export const App = (): JSX.Element => {
  const interpretationContext = useInterpretationContext()
  const { connected, minimized } = interpretationContext.state

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
    }
    bootStrap().catch((e) => { console.error(e) })
  }, [])

  useEffect(() => {
    refreshContextEvents(interpretationContext)
    refreshContextButton(interpretationContext)
    refreshContextForms(interpretationContext)
    refreshContextPrompts(interpretationContext)
  }, [interpretationContext])

  return (
    <div data-testid='App'>
      {connected && !minimized
        ? <Widget />
        : null
      }
    </div>
  )
}
