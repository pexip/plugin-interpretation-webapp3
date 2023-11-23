import React from 'react'

import { Role } from '../types/Role'
import { showDisconnectPrompt } from '../prompts'
import { type Language } from '../types/Language'
import { Volume } from './Volume/Volume'
import { AdvanceLanguageSelector } from './AdvanceLanguageSelector/AdvanceLanguageSelector'
import { BaseLanguageSelector } from './BaseLanguageSelector/BaseLanguageSelector'
import { DraggableDialog } from './DraggableDialog/DraggableDialog'
import { MuteButton } from './MuteButton/MuteButton'

interface WidgetProps {
  defaultLanguage: Language
  role: Role
  allowChangeDirection: boolean
  onMinimize: () => void
}

export const Widget = (props: WidgetProps): JSX.Element => {
  return (
    <DraggableDialog
      title='Interpretation'
      onMinimize={() => {
        throw new Error('Function not implemented.')
      }}
      onClose={() => {
        showDisconnectPrompt().catch((e) => { console.error(e) })
      }}>
      <div className='Container'>
        {props.role === Role.Interpreter && <>
          {props.allowChangeDirection &&
            <AdvanceLanguageSelector defaultLanguage={props.defaultLanguage}
              role={Role.Interpreter}
            />
          }
          {!props.allowChangeDirection &&
            <BaseLanguageSelector defaultLanguage={props.defaultLanguage}
              role={Role.Interpreter}
            />
          }
          <MuteButton />
        </>}
        {props.role === Role.Listener && <>
          <BaseLanguageSelector defaultLanguage={props.defaultLanguage}
            role={Role.Listener}
          />
          <Volume />
        </>}
      </div>
    </DraggableDialog>
  )
}
