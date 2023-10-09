import React from 'react'

import { Select } from '@pexip/components'
import { type Language, getLanguageOptions } from '../../../language'

import './LanguageSelector.scss'

interface LanguagesSelectorProps {
  defaultLanguage: Language
}

export const LanguagesSelector = (props: LanguagesSelectorProps): JSX.Element => {
  return (
    <div className='LanguageSelector'>

      <Select className='Selector' value={'main'} label={'From'} onValueChange={function (id: string): void {
        throw new Error('Function not implemented.')
      } } options={[{
        id: 'main',
        label: 'Main floor'
      }]} isFullWidth />

      <button className='exchange'>
        <img src='exchange.svg' />
      </button>

      <Select className='Selector' label={'To'} isFullWidth
        value={props.defaultLanguage.code}
        options={getLanguageOptions()}
        onValueChange={function (id: string): void {
          throw new Error('Function not implemented.')
        }}
      />

    </div>
  )
}
