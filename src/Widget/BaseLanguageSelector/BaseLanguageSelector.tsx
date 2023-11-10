import React, { useState } from 'react'
import { getLanguageByCode, getLanguageOptions, type Language } from '../../language'
import { Select } from '@pexip/components'

import './BaseLanguageSelector.scss'
import { Interpretation } from '../../interpretation/interpretation'

interface BaseLanguageSelectorProps {
  defaultLanguage: Language
}

export const BaseLanguageSelector = (props: BaseLanguageSelectorProps): JSX.Element => {
  const [language, setLanguage] = useState<Language>()

  const handleChangeLanguage = async (code: string): Promise<void> => {
    const language = getLanguageByCode(code)
    setLanguage(language)
    if (language != null) {
      await Interpretation.connect(language)
    }
  }

  return (
    <Select className='BaseLanguageSelector' isFullWidth
      label={''}
      value={language?.code ?? props.defaultLanguage.code}
      options={getLanguageOptions()}
      onValueChange={(code: string) => { handleChangeLanguage(code).catch((e) => { console.error(e) }) }}
    />
  )
}
