import React from 'react'

import { Role } from '../types/Role'
import { showDisconnectPrompt } from '../prompts'
import { type Language } from '../language'
import { Settings } from './Settings/Settings'
import { Volume } from './Volume/Volume'
import { AdvanceLanguageSelector } from './AdvanceLanguageSelector/AdvanceLanguageSelector'
import { BaseLanguageSelector } from './BaseLanguageSelector/BaseLanguageSelector'
import { DraggableDialog } from './DraggableDialog/DraggableDialog'

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
            <AdvanceLanguageSelector defaultLanguage={props.defaultLanguage} />
          }
          {!props.allowChangeDirection &&
            <BaseLanguageSelector defaultLanguage={props.defaultLanguage} />
          }
          <Settings />
        </>}
        {props.role === Role.Listener && <>
          <BaseLanguageSelector defaultLanguage={props.defaultLanguage} />
          <Volume />
        </>}
      </div>
    </DraggableDialog>
  )
}
