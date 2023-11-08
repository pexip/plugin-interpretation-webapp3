import React, { useState } from 'react'

import { Select } from '@pexip/components'
import { type Language, getLanguageOptions, getLanguageByCode } from '../../language'

import './InterpreterSelector.scss'
import { Interpretation } from '../../interpretation'

interface InterpreterSelectorProps {
  defaultLanguage: Language
}

export const InterpreterSelector = (props: InterpreterSelectorProps): JSX.Element => {
  const [language, setLanguage] = useState<Language>()
  const [reversed, setReversed] = useState(false)

  const classes = ['InterpreterSelector']
  if (reversed) {
    classes.push('reversed')
  }

  return (
    <div className={classes.join(' ')}>

      <Select className='FromSelect Select' value={'main'}
        label={reversed ? 'To' : 'From'}
        isDisabled={true}
        onValueChange={() => {}}
        options={[{
          id: 'main',
          label: 'Main floor'
        }]} isFullWidth />

      <button className='exchange' onClick={() => { setReversed(!reversed) }}>
        <img src='exchange.svg' />
      </button>

      <Select className='ToSelect Select'
        label={reversed ? 'From' : 'To'}
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

    </div>
  )
}
