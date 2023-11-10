import React, { useState } from 'react'

import { Select } from '@pexip/components'
import { type Language, getLanguageOptions, getLanguageByCode } from '../../language'

import './AdvanceLanguageSelector.scss'
import { Interpretation } from '../../interpretation/interpretation'

interface AdvanceLanguageSelectorProps {
  defaultLanguage: Language
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
      await Interpretation.connect(newLanguage)
    }
  }

  const handleChangeDirection = async (): Promise<void> => {
    const newValue = !reversed
    setReversed(!newValue)
  }

  const classes = ['AdvanceLanguageSelectorProps']
  if (reversed) {
    classes.push('reversed')
  }

  return (
    <div className={classes.join(' ')}>

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
