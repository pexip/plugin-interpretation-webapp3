import React from 'react'
import { Volume } from './Volume'
import { render, screen } from '@testing-library/react'

jest.mock('@pexip/components', () => ({
  RangeSlider: (props: any) => <div></div>
}))

jest.mock('../../interpretation/interpretation', () => ({
  Interpretation: jest.fn()
}))

describe('Volume', () => {
  it('should render', () => {
    render(<Volume />)
    const volume = screen.getByTestId('Volume')
    expect(volume).toBeInTheDocument()
  })
})
