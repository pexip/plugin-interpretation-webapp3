import React from 'react'

import type { Role } from '../../types/Role'
import { showDisconnectPrompt } from '../../prompts'
import { type Language } from '../../language'
import { Settings } from './Settings/Settings'
import { Volume } from './Volume/Volume'
import { LanguagesSelector } from './LanguageSelector/LanguageSelector'
import { DraggableDialog } from './DraggableDialog/DraggableDialog'

interface LanguagePanelProps {
  defaultLanguage: Language
  role: Role
}

export const LanguagePanel = (props: LanguagePanelProps): JSX.Element => {
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
        <LanguagesSelector defaultLanguage={props.defaultLanguage} />
        <Volume />
        <Settings />
      </div>
    </DraggableDialog>
  )
}
