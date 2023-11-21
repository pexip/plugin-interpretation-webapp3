import React from 'react'
import { Volume } from './Volume'
import { fireEvent, render, screen } from '@testing-library/react'

jest.mock('@pexip/components', () => ({
  RangeSlider: (props: any) => <input onChange={props.onChange} data-testid='MockSlider'/>
}))

const mockSetMainRoomVolume = jest.fn()
const mockSetInterpretationVolume = jest.fn()
jest.mock('../../interpretation/interpretation', () => ({
  Interpretation: {
    setMainRoomVolume: (volume: number) => mockSetMainRoomVolume(volume),
    setInterpretationVolume: (volume: number) => mockSetInterpretationVolume(volume)
  }
}))

describe('Volume', () => {
  beforeEach(() => {
    mockSetMainRoomVolume.mockClear()
    mockSetInterpretationVolume.mockClear()
  })

  it('should render', () => {
    render(<Volume />)
    const volume = screen.getByTestId('Volume')
    expect(volume).toBeInTheDocument()
  })

  describe('Slider on the left (0%)', () => {
    it('should change main room volume to 100%', () => {
      render(<Volume />)
      const mockSlider = screen.getByTestId('MockSlider')
      fireEvent.change(mockSlider, { target: { value: 0 } })
      expect(mockSetMainRoomVolume).toHaveBeenCalledTimes(1)
      expect(mockSetMainRoomVolume).toHaveBeenCalledWith(1)
    })

    it('should change interpretation volume to 0%', () => {
      render(<Volume />)
      const mockSlider = screen.getByTestId('MockSlider')
      fireEvent.change(mockSlider, { target: { value: 0 } })
      expect(mockSetInterpretationVolume).toHaveBeenCalledTimes(1)
      expect(mockSetInterpretationVolume).toHaveBeenCalledWith(0)
    })
  })

  describe('Slider on the middle left (25%)', () => {
    it('should change main room volume to 100%', () => {
      render(<Volume />)
      const mockSlider = screen.getByTestId('MockSlider')
      fireEvent.change(mockSlider, { target: { value: 25 } })
      expect(mockSetMainRoomVolume).toHaveBeenCalledTimes(1)
      expect(mockSetMainRoomVolume).toHaveBeenCalledWith(1)
    })

    it('should change interpretation volume to 50%', () => {
      render(<Volume />)
      const mockSlider = screen.getByTestId('MockSlider')
      fireEvent.change(mockSlider, { target: { value: 25 } })
      expect(mockSetInterpretationVolume).toHaveBeenCalledTimes(1)
      expect(mockSetInterpretationVolume).toHaveBeenCalledWith(0.5)
    })
  })

  describe('Slider on the middle (50%)', () => {
    it('should change main room volume to 100%', () => {
      render(<Volume />)
      const mockSlider = screen.getByTestId('MockSlider')
      fireEvent.change(mockSlider, { target: { value: 50 } })
      expect(mockSetMainRoomVolume).toHaveBeenCalledTimes(1)
      expect(mockSetMainRoomVolume).toHaveBeenCalledWith(1)
    })

    it('should change interpretation volume to 100%', () => {
      render(<Volume />)
      const mockSlider = screen.getByTestId('MockSlider')
      fireEvent.change(mockSlider, { target: { value: 50 } })
      expect(mockSetInterpretationVolume).toHaveBeenCalledTimes(1)
      expect(mockSetInterpretationVolume).toHaveBeenCalledWith(1)
    })
  })

  describe('Slider on the middle right (75%)', () => {
    it('should change main room volume to 50%', () => {
      render(<Volume />)
      const mockSlider = screen.getByTestId('MockSlider')
      fireEvent.change(mockSlider, { target: { value: 75 } })
      expect(mockSetMainRoomVolume).toHaveBeenCalledTimes(1)
      expect(mockSetMainRoomVolume).toHaveBeenCalledWith(0.5)
    })

    it('should change interpretation volume to 100%', () => {
      render(<Volume />)
      const mockSlider = screen.getByTestId('MockSlider')
      fireEvent.change(mockSlider, { target: { value: 75 } })
      expect(mockSetInterpretationVolume).toHaveBeenCalledTimes(1)
      expect(mockSetInterpretationVolume).toHaveBeenCalledWith(1)
    })
  })

  describe('Slider on the right (100%)', () => {
    it('should change main room volume to 0%', () => {
      render(<Volume />)
      const mockSlider = screen.getByTestId('MockSlider')
      fireEvent.change(mockSlider, { target: { value: 100 } })
      expect(mockSetMainRoomVolume).toHaveBeenCalledTimes(1)
      expect(mockSetMainRoomVolume).toHaveBeenCalledWith(0)
    })

    it('should change interpretation volume to 100%', () => {
      render(<Volume />)
      const mockSlider = screen.getByTestId('MockSlider')
      fireEvent.change(mockSlider, { target: { value: 100 } })
      expect(mockSetInterpretationVolume).toHaveBeenCalledTimes(1)
      expect(mockSetInterpretationVolume).toHaveBeenCalledWith(1)
    })
  })
})
