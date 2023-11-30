import React from 'react'
import { AdvanceLanguageSelector } from './AdvanceLanguageSelector'
import { render, screen } from '@testing-library/react'

jest.mock('@pexip/components', () => ({
  Select: (props: any) => {
    const { isDisabled, isFullWidth, onValueChange, ...otherProps } = props
    return <input {...otherProps} onChange={
      (event) => { onValueChange(event.target.value) }
    }/>
  }
}))

jest.mock('../../InterpretationContext/InterpretationContext', () => ({
  useInterpretationContext: () => ({
    changeLanguage: jest.fn(),
    state: {
      language: jest.fn()
    }
  })
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
    render(<AdvanceLanguageSelector />)
    const selector = screen.getByTestId('AdvanceLanguageSelector')
    expect(selector).toBeInTheDocument()
  })
})
