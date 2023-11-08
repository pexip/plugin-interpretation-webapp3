import React, { useState } from 'react'
import { getLanguageByCode, getLanguageOptions, type Language } from '../../language'
import { Select } from '@pexip/components'

import './ListenerSelector.scss'
import { Interpretation } from '../../interpretation'

interface ListenerSelectorProps {
  defaultLanguage: Language
}

export const ListenerSelector = (props: ListenerSelectorProps): JSX.Element => {
  const [language, setLanguage] = useState<Language>()

  return (
    <Select className='ListenerSelector' isFullWidth
      label={''}
      value={language?.code ?? props.defaultLanguage.code}
      options={getLanguageOptions()}
      onValueChange={(code: string) => {
        const language = getLanguageByCode(code)
        setLanguage(language)
        if (language != null) {
          Interpretation.setLanguage(language)
        }
      }}
    />
  )
}
