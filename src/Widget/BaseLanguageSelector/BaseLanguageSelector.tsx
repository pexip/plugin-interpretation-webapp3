import React, { useState } from 'react'

import { getLanguageByCode, getLanguageOptions } from '../../language'
import type { Language } from '../../types/Language'
import { Select } from '@pexip/components'
import { type ConnectRequest, Interpretation } from '../../interpretation/interpretation'
import type { Role } from '../../types/Role'

import './BaseLanguageSelector.scss'

interface BaseLanguageSelectorProps {
  defaultLanguage: Language
  role: Role
}

export const BaseLanguageSelector = (props: BaseLanguageSelectorProps): JSX.Element => {
  const [language, setLanguage] = useState<Language>()

  const handleChangeLanguage = async (code: string): Promise<void> => {
    const language = getLanguageByCode(code)
    setLanguage(language)
    if (language != null) {
      const request: ConnectRequest = {
        language,
        role: props.role
      }
      await Interpretation.connect(request)
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
