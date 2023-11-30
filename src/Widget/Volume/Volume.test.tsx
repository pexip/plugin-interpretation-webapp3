import React from 'react'
import { Volume } from './Volume'
import { render, screen } from '@testing-library/react'

jest.mock('@pexip/components', () => ({
  RangeSlider: (props: any) => <input onChange={props.onChange} data-testid='MockSlider'/>
}))

jest.mock('../../InterpretationContext/InterpretationContext', () => ({
  useInterpretationContext: () => ({
    changeVolume: jest.fn(),
    state: {
      volume: jest.fn()
    }
  })
}))

describe('Volume', () => {
  it('should render', () => {
    render(<Volume />)
    const volume = screen.getByTestId('Volume')
    expect(volume).toBeInTheDocument()
  })
})
