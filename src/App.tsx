import React, { useEffect } from 'react'

import { registerPlugin } from '@pexip/plugin-api'
import { setPlugin } from './plugin'
import { initializeEvents } from './events'
import { initializeButton } from './button'
import { initializeIFrame } from './iframe'
import { Widget } from './Widget/Widget'
import { useInterpretationContext } from './InterpretationContext/InterpretationContext'
import { setInterpretationContext } from './interpretationContext'

export const App = (): JSX.Element => {
  const interpretationContext = useInterpretationContext()
  const { connected, connecting, minimized } = interpretationContext.state

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
    bootStrap().catch((e) => {
      console.error(e)
    })
  }, [])

  useEffect(() => {
    setInterpretationContext(interpretationContext)
  }, [interpretationContext])

  return (
    <div data-testid="App">
      {(connected || connecting) && !minimized ? <Widget /> : null}
    </div>
  )
}
