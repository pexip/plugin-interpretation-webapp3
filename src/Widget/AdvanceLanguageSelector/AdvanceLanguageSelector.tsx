import React, { useState } from 'react'

import { Select } from '@pexip/components'
import { getLanguageOptions, getLanguageByCode } from '../../language'
import type { Language } from '../../types/Language'
import { type ConnectRequest, Interpretation } from '../../interpretation/interpretation'
import { Direction } from '../../types/Direction'
import type { Role } from '../../types/Role'
import clsx from 'clsx'

import './AdvanceLanguageSelector.scss'

interface AdvanceLanguageSelectorProps {
  defaultLanguage: Language
  role: Role
}

export const AdvanceLanguageSelector = (props: AdvanceLanguageSelectorProps): JSX.Element => {
  const [language, setLanguage] = useState<Language>()
  const [reversed, setReversed] = useState(false)

  const handleChangeLanguage = async (code: string): Promise<void> => {
    let newLanguage = language
    if (code != null) {
      newLanguage = getLanguageByCode(code)
      setLanguage(newLanguage)
    }
    if (newLanguage != null) {
      const request: ConnectRequest = {
        language: newLanguage,
        role: props.role,
        direction: reversed ? Direction.InterpretationToMainRoom : Direction.MainRoomToInterpretation
      }
      await Interpretation.connect(request)
    }
  }

  const handleChangeDirection = async (): Promise<void> => {
    const newValue = !reversed
    setReversed(newValue)
    // TODO: To change direction in the channel
  }

  return (
    <div className={clsx('AdvanceLanguageSelector', { reversed })}>

      <Select className='FromSelect Select' isFullWidth
        label={reversed ? 'To' : 'From'}
        value={'main'}
        isDisabled={true}
        onValueChange={() => {}}
        options={[{
          id: 'main',
          label: 'Main floor'
        }]}
      />

      <button className='exchange' onClick={() => { handleChangeDirection().catch((e) => { console.error(e) }) }}>
        <img src='exchange.svg' />
      </button>

      <Select className='ToSelect Select' isFullWidth
        label={reversed ? 'From' : 'To'}
        value={language?.code ?? props.defaultLanguage.code}
        options={getLanguageOptions()}
        onValueChange={(code: string) => { handleChangeLanguage(code).catch((e) => { console.error(e) }) }}
      />

    </div>
  )
}
