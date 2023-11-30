import React from 'react'
import { MuteButton } from './MuteButton'
import { render, screen } from '@testing-library/react'

jest.mock('@pexip/components', () => ({
  Button: (props: any) => <button {...props}></button>,
  Icon: (props: any) => <span>{props.source}</span>,
  IconTypes: {
    IconMicrophoneOn: 'mic-on',
    IconMicrophoneOff: 'mic-off'
  }
}))

jest.mock('../../InterpretationContext/InterpretationContext', () => ({
  useInterpretationContext: () => ({
    changeMute: jest.fn(),
    state: {
      muted: jest.fn()
    }
  })
}))

describe('MuteButton', () => {
  it('should render', () => {
    render(<MuteButton />)
    const button = screen.getByTestId('MuteButton')
    expect(button).toBeInTheDocument()
  })
})
