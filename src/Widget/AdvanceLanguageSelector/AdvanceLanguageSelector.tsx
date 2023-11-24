import React from 'react'

import { Select } from '@pexip/components'
import { getLanguageOptions, getLanguageByCode } from '../../language'
import type { Language } from '../../types/Language'
import { Direction } from '../../types/Direction'
import clsx from 'clsx'

import './AdvanceLanguageSelector.scss'

interface AdvanceLanguageSelectorProps {
  language: Language
  direction: Direction
  onChangeLanguage: (language: Language) => void
  onChangeDirection: (direction: Direction) => void
}

export const AdvanceLanguageSelector = (props: AdvanceLanguageSelectorProps): JSX.Element => {
  const reversed = props.direction === Direction.InterpretationToMainRoom

  const handleChangeLanguage = (code: string): void => {
    const language = getLanguageByCode(code)
    if (language != null) {
      props.onChangeLanguage(language)
    }
  }

  const handleChangeDirection = (): void => {
    let direction = Direction.MainRoomToInterpretation
    if (props.direction === Direction.MainRoomToInterpretation) {
      direction = Direction.InterpretationToMainRoom
    }
    props.onChangeDirection(direction)
  }

  return (
    <div
      className={clsx('AdvanceLanguageSelector', { reversed })}
      data-testid='AdvanceLanguageSelector'
    >

      <Select className='MainFloorSelect Select' isFullWidth
        label={reversed ? 'To' : 'From'}
        value={'main'}
        isDisabled={true}
        onValueChange={() => {}}
        options={[{
          id: 'main',
          label: 'Main floor'
        }]}
      />

      <button
        className='exchange'
        aria-label='exchange button'
        onClick={handleChangeDirection}>
        <img src='exchange.svg' />
      </button>

      <Select className='LanguageSelect Select' isFullWidth
        aria-label='language select'
        label={reversed ? 'From' : 'To'}
        value={props.language.code}
        options={getLanguageOptions()}
        onValueChange={handleChangeLanguage}
      />

    </div>
  )
}
