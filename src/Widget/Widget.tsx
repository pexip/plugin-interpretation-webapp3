import React from 'react'

import { Role } from '../types/Role'
import { showDisconnectPrompt } from '../prompts'
import { type Language } from '../language'
import { Settings } from './Settings/Settings'
import { Volume } from './Volume/Volume'
import { InterpreterSelector } from './InterpreterSelector/InterpreterSelector'
import { ListenerSelector } from './ListenerSelector/ListenerSelector'
import { DraggableDialog } from './DraggableDialog/DraggableDialog'

interface WidgetProps {
  defaultLanguage: Language
  role: Role
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
        {props.role === Role.Interpreter &&
          <>
            <InterpreterSelector defaultLanguage={props.defaultLanguage} />
            <Settings />
          </>
        }
        {props.role === Role.Listener &&
          <>
            <ListenerSelector defaultLanguage={props.defaultLanguage} />
            <Volume />
          </>
        }
      </div>
    </DraggableDialog>
  )
}
