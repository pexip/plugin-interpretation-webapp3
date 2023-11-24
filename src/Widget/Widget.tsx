import React, { useState } from 'react'

import { Role } from '../types/Role'
import { showDisconnectPrompt } from '../prompts'
import { type Language } from '../types/Language'
import { Volume } from './Volume/Volume'
import { AdvanceLanguageSelector } from './AdvanceLanguageSelector/AdvanceLanguageSelector'
import { BaseLanguageSelector } from './BaseLanguageSelector/BaseLanguageSelector'
import { DraggableDialog } from './DraggableDialog/DraggableDialog'
import { MuteButton } from './MuteButton/MuteButton'
import { type ConnectRequest, Interpretation } from '../interpretation/interpretation'
import { Direction } from '../types/Direction'
import { capitalizeFirstLetter } from '../utils'

interface WidgetProps {
  defaultLanguage: Language
  role: Role
  allowChangeDirection: boolean
  onMinimize: () => void
}

export const Widget = (props: WidgetProps): JSX.Element => {
  const [language, setLanguage] = useState<Language>(props.defaultLanguage)
  const [direction, setDirection] = useState<Direction>(Direction.MainRoomToInterpretation)

  const handleChangeLanguage = (language: Language): void => {
    if (language != null) {
      const request: ConnectRequest = {
        language,
        role: props.role
      }
      Interpretation.connect(request).catch((e) => { console.error(e) })
    }
    setLanguage(language)
  }

  const handleChangeDirection = (direction: Direction): void => {
    // TODO: Mute directions
    setDirection(direction)
  }

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
            <AdvanceLanguageSelector
              language={language}
              direction={direction}
              onChangeLanguage={handleChangeLanguage}
              onChangeDirection={handleChangeDirection}
            />
          }
          {!props.allowChangeDirection &&
            <BaseLanguageSelector
              language={language}
              onChangeLanguage={handleChangeLanguage}
            />
          }
          <MuteButton label={
            direction === Direction.MainRoomToInterpretation
              ? capitalizeFirstLetter(language?.name ?? '')
              : 'Main floor'
          }/>
        </>}
        {props.role === Role.Listener && <>
          <BaseLanguageSelector
            language={language}
            onChangeLanguage={handleChangeLanguage}
          />
          <Volume />
        </>}
      </div>
    </DraggableDialog>
  )
}
