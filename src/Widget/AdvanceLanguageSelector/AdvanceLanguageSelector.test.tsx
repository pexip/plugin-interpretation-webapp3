import React from 'react'
import { AdvanceLanguageSelector } from './AdvanceLanguageSelector'
import { act, fireEvent, render, screen } from '@testing-library/react'
import type { Language } from '../../types/Language'
import { Role } from '../../types/Role'
import { Direction } from '../../types/Direction'

jest.mock('@pexip/components', () => ({
  Select: (props: any) => <div>{props.label}</div>
}))

const mockConnect = jest.fn()
const mockChangeDirection = jest.fn()
jest.mock('../../interpretation/interpretation', () => ({
  Interpretation: {
    connect: (params: any) => mockConnect(params),
    changeDirection: (params: any) => mockChangeDirection(params)
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
  name: 'Spanish'
}

describe('AdvanceLanguageSelector', () => {
  beforeEach(() => {
    mockConnect.mockClear()
    mockChangeDirection.mockClear()
  })
  it('should render', () => {
    render(<AdvanceLanguageSelector defaultLanguage={language} role={Role.Interpreter}/>)
    const selector = screen.getByTestId('AdvanceLanguageSelector')
    expect(selector).toBeInTheDocument()
  })

  describe('reverse direction', () => {
    it('shouldn\'t have the class "reversed" at the beginning', () => {
      render(<AdvanceLanguageSelector defaultLanguage={language} role={Role.Interpreter}/>)
      const selector = screen.getByTestId('AdvanceLanguageSelector')
      expect(selector).not.toHaveClass('reversed')
    })

    it('should add the class "reversed" to change the style', async () => {
      render(<AdvanceLanguageSelector defaultLanguage={language} role={Role.Interpreter}/>)
      const button = screen.getByRole('button', { name: 'exchange button' })
      await act(async () => {
        fireEvent.click(button)
      })
      const selector = screen.getByTestId('AdvanceLanguageSelector')
      expect(selector).toHaveClass('reversed')
    })

    it('should\'t have the class "reversed" if clicked twice', async () => {
      render(<AdvanceLanguageSelector defaultLanguage={language} role={Role.Interpreter}/>)
      const button = screen.getByRole('button', { name: 'exchange button' })
      await act(async () => {
        fireEvent.click(button)
      })
      await act(async () => {
        fireEvent.click(button)
      })
      const selector = screen.getByTestId('AdvanceLanguageSelector')
      expect(selector).not.toHaveClass('reversed')
    })

    it('should call Interpreter.changeDirection with the new direction', async () => {
      render(<AdvanceLanguageSelector defaultLanguage={language} role={Role.Interpreter}/>)
      const button = screen.getByRole('button', { name: 'exchange button' })
      await act(async () => {
        fireEvent.click(button)
      })
      expect(mockChangeDirection).toHaveBeenCalledTimes(1)
      expect(mockChangeDirection).toHaveBeenCalledWith(Direction.InterpretationToMainRoom)
    })

    it('should call Interpreter.changeDirection with the new direction', async () => {
      render(<AdvanceLanguageSelector defaultLanguage={language} role={Role.Interpreter}/>)
      const button = screen.getByRole('button', { name: 'exchange button' })
      await act(async () => {
        fireEvent.click(button)
      })
      expect(mockChangeDirection).toHaveBeenCalledTimes(1)
      expect(mockChangeDirection).toHaveBeenCalledWith(Direction.InterpretationToMainRoom)
    })

    it('should call Interpreter.changeDirection with the original direction when called twice', async () => {
      render(<AdvanceLanguageSelector defaultLanguage={language} role={Role.Interpreter}/>)
      const button = screen.getByRole('button', { name: 'exchange button' })
      await act(async () => {
        fireEvent.click(button)
      })
      await act(async () => {
        fireEvent.click(button)
      })
      expect(mockChangeDirection).toHaveBeenCalledTimes(2)
      expect(mockChangeDirection).toHaveBeenCalledWith(Direction.MainRoomToInterpretation)
    })
  })
})
