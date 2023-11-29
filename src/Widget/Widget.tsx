import React from 'react'

import { Role } from '../types/Role'
import { Volume } from './Volume/Volume'
import { AdvanceLanguageSelector } from './AdvanceLanguageSelector/AdvanceLanguageSelector'
import { BaseLanguageSelector } from './BaseLanguageSelector/BaseLanguageSelector'
import { DraggableDialog } from './DraggableDialog/DraggableDialog'
import { MuteButton } from './MuteButton/MuteButton'
import { useInterpretationContext } from '../InterpretationContext/InterpretationContext'
import { config } from '../config'

export const Widget = (): JSX.Element => {
  const { state } = useInterpretationContext()
  const { role } = state

  const allowChangeDirection = config.allowChangeDirection

  return (
    <DraggableDialog title='Interpretation'>
      <div className='Container'>
        {role === Role.Interpreter && <>
          {allowChangeDirection &&
            <AdvanceLanguageSelector />
          }
          {!allowChangeDirection &&
            <BaseLanguageSelector />
          }
          <MuteButton />
        </>}
        {role === Role.Listener && <>
          <BaseLanguageSelector />
          <Volume />
        </>}
      </div>
    </DraggableDialog>
  )
}
