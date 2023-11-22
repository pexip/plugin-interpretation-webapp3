import React from 'react'
import { AdvanceLanguageSelector } from './AdvanceLanguageSelector'
import { render } from '@testing-library/react'
import type { Language } from '../../types/Language'
import { Role } from '../../types/Role'

jest.mock('@pexip/components', () => ({
  Select: (props: any) => <div>{props.label}</div>
}))

jest.mock('../../interpretation/interpretation', () => ({
  Interpretation: {
    connect: jest.fn(() => { console.log('test') })
  }
}))

jest.mock('../../config', () => ({
  config: {
    languages: [
      {
        code: '0033',
        name: 'french'
      },
      {
        code: '0034',
        name: 'spanish'
      }
    ]
  }
}))

describe('AdvanceLanguageSelector', () => {
  it('should render', () => {
    const language: Language = {
      code: '0034',
      name: 'Spanish'
    }
    render(<AdvanceLanguageSelector defaultLanguage={language} role={Role.Interpreter}/>)
  })
})
