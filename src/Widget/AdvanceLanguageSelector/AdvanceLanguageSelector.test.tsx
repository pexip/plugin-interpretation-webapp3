import React from 'react'
import { AdvanceLanguageSelector } from './AdvanceLanguageSelector'
import { act, fireEvent, render, screen } from '@testing-library/react'
import type { Language } from '../../types/Language'
import { Direction } from '../../types/Direction'

jest.mock('@pexip/components', () => ({
  Select: (props: any) => {
    const { isDisabled, isFullWidth, onValueChange, ...otherProps } = props
    return <input {...otherProps} onChange={
      (event) => { onValueChange(event.target.value) }
    }/>
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

const language: Language = {
  code: '0034',
  name: 'spanish'
}

const language2: Language = {
  code: '0033',
  name: 'french'
}

describe('AdvanceLanguageSelector', () => {
  it('should render', () => {
    render(<AdvanceLanguageSelector
      language={language}
      direction={Direction.MainRoomToInterpretation}
      onChangeLanguage={() => {}}
      onChangeDirection={() => {}}
    />)
    const selector = screen.getByTestId('AdvanceLanguageSelector')
    expect(selector).toBeInTheDocument()
  })

  describe('change language', () => {
    it('should call onChangeLanguage with the new language when changed', async () => {
      const mockChangeLanguage = jest.fn()
      render(<AdvanceLanguageSelector
        language={language}
        direction={Direction.MainRoomToInterpretation}
        onChangeLanguage={mockChangeLanguage}
        onChangeDirection={() => {}}
      />)
      await act(async () => {
        const input = screen.getByRole('textbox', { name: 'language select' })
        fireEvent.change(input, { target: { value: language2.code } })
      })
      expect(mockChangeLanguage).toHaveBeenCalledTimes(1)
      expect(mockChangeLanguage).toHaveBeenCalledWith(language2)
    })
  })

  describe('reverse direction', () => {
    it('shouldn\'t have the class "reversed" at the beginning', () => {
      render(<AdvanceLanguageSelector
        language={language}
        direction={Direction.MainRoomToInterpretation}
        onChangeLanguage={() => {}}
        onChangeDirection={() => {}}
      />)
      const selector = screen.getByTestId('AdvanceLanguageSelector')
      expect(selector).not.toHaveClass('reversed')
    })

    it('should have the class "reversed" if direction is InterpretationToMainRoom', async () => {
      render(<AdvanceLanguageSelector
        language={language}
        direction={Direction.InterpretationToMainRoom}
        onChangeLanguage={() => {}}
        onChangeDirection={() => {}}
      />)
      const selector = screen.getByTestId('AdvanceLanguageSelector')
      expect(selector).toHaveClass('reversed')
    })

    it('should call onChangeDirection with the new direction when clicked button', async () => {
      const mockChangeDirection = jest.fn()
      render(<AdvanceLanguageSelector
        language={language}
        direction={Direction.MainRoomToInterpretation}
        onChangeLanguage={() => {}}
        onChangeDirection={mockChangeDirection}
      />)
      const button = screen.getByRole('button', { name: 'exchange button' })
      await act(async () => {
        fireEvent.click(button)
      })
      expect(mockChangeDirection).toHaveBeenCalledTimes(1)
      expect(mockChangeDirection).toHaveBeenCalledWith(Direction.InterpretationToMainRoom)
    })
  })
})
