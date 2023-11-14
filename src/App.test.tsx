import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { App } from './App'
import { Interpretation } from './interpretation/interpretation'
import type { Language } from './language'
import { Direction } from './types/Direction'

jest.mock('@pexip/plugin-api', () => ({
  registerPlugin: jest.fn()
}))

jest.mock('@pexip/components', () => ({
  ThemeProvider: (props: any) => <div data-testid='App'>{props.children}</div>
}))

jest.mock('./Widget/Widget', () => ({
  Widget: () => <div data-testid='Widget'></div>
}))

jest.mock('./button', () => ({
  initializeButton: jest.fn(),
  setButtonActive: jest.fn(async () => { await Promise.resolve() })
}))

jest.mock('./events', () => ({
  initializeEvents: jest.fn()
}))

jest.mock('./interpretation/interpretation', () => {
  let languageCallback: (language: Language, direction: Direction) => void
  return {
    Interpretation: {
      registerOnChangeLanguageCallback: jest.fn((callback) => { languageCallback = callback }),
      connect: jest.fn((language, direction) => { languageCallback(language, direction) })
    }
  }
})

jest.mock('./config', () => ({
  config: jest.fn()
}))

describe('App', () => {
  it('should render', () => {
    render(<App />)
    const app = screen.getByTestId('App')
    expect(app).toBeInTheDocument()
  })

  it('shouldn\'t display the Widget on load', () => {
    render(<App />)
    const widget = screen.queryByTestId('Widget')
    expect(widget).not.toBeInTheDocument()
  })

  it('should display the Widget once the change language callback is triggered', async () => {
    await act(async () => {
      render(<App />)
    })
    const language: Language = {
      code: '0034',
      name: 'Spanish'
    }
    await act(async () => {
      await Interpretation.connect(language, Direction.MainRoomToInterpretation)
    })
    const widget = screen.getByTestId('Widget')
    expect(widget).toBeInTheDocument()
  })
})
