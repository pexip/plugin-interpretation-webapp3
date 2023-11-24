import React from 'react'

import { getLanguageByCode, getLanguageOptions } from '../../language'
import type { Language } from '../../types/Language'
import { Select } from '@pexip/components'

import './BaseLanguageSelector.scss'

interface BaseLanguageSelectorProps {
  language: Language
  onChangeLanguage: (language: Language) => void
}

export const BaseLanguageSelector = (props: BaseLanguageSelectorProps): JSX.Element => {
  const handleChangeLanguage = (code: string): void => {
    const language = getLanguageByCode(code)
    if (language != null) {
      props.onChangeLanguage(language)
    }
  }

  return (
    <Select className='BaseLanguageSelector' isFullWidth
      label={''}
      value={props.language.code}
      options={getLanguageOptions()}
      onValueChange={handleChangeLanguage}
    />
  )
}
