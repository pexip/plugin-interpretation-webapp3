import React from 'react'

import { Role } from '../types/Role'
import { Volume } from './Volume/Volume'
import { AdvanceLanguageSelector } from './AdvanceLanguageSelector/AdvanceLanguageSelector'
import { BaseLanguageSelector } from './BaseLanguageSelector/BaseLanguageSelector'
import { DraggableDialog } from './DraggableDialog/DraggableDialog'
import { MuteButton } from './MuteButton/MuteButton'
import { useInterpretationContext } from '../InterpretationContext/InterpretationContext'
import { config } from '../config'
import { Connecting } from './Connecting/Connecting'

export const Widget = (): JSX.Element => {
  const { state } = useInterpretationContext()
  const { connecting, role } = state

  const allowChangeDirection = config.interpreter?.allowChangeDirection
  const showListenerMuteButton = config.listener?.speakToInterpretationRoom

  return (
    <DraggableDialog title="Interpretation">
      <div className="Container">
        {connecting && <Connecting />}
        {!connecting && role === Role.Interpreter && (
          <>
            {allowChangeDirection && <AdvanceLanguageSelector />}
            {!allowChangeDirection && <BaseLanguageSelector />}
            <MuteButton />
          </>
        )}
        {!connecting && role === Role.Listener && (
          <>
            <BaseLanguageSelector />
            <Volume />
            {showListenerMuteButton && <MuteButton />}
          </>
        )}
      </div>
    </DraggableDialog>
  )
}
