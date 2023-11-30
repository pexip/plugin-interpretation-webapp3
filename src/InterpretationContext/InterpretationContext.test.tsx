import React from 'react'
import { InterpretationContextProvider } from './InterpretationContext'
import { render, screen } from '@testing-library/react'

jest.mock('../config.ts', () => ({
  config: {
    role: 'interpreter'
  }
}))

jest.mock('../main-room/media-constraints', () => ({
  MainRoomMediaConstraints: jest.fn()
}))

const mockCall = jest.fn()
const mockMute = jest.fn()
const mockSetStream = jest.fn()
const mockDisconnect = jest.fn()

let onAuthenticatedWithConferenceCallback: () => void
jest.mock('@pexip/infinity', () => {
  return {
    ClientCallType: {
      AudioRecvOnly: 0,
      AudioSendOnly: 1
    },
    createInfinityClientSignals: jest.fn(() => ({
      onAuthenticatedWithConference: {
        add: jest.fn((callback) => {
          onAuthenticatedWithConferenceCallback = callback
        })
      },
      onError: { add: jest.fn() },
      onPinRequired: { add: jest.fn() }
    })),
    createCallSignals: jest.fn(() => ({
      onRemoteStream: { add: jest.fn() }
    })),
    createInfinityClient: jest.fn(() => ({
      call: (params: any) => {
        mockCall(params)
        onAuthenticatedWithConferenceCallback()
      },
      mute: (params: any) => { mockMute(params) },
      setStream: (params: any) => { mockSetStream(params) },
      disconnect: (params: any) => { mockDisconnect(params) }
    }))
  }
}, { virtual: true })

const InterpretationContextTester = (): JSX.Element => {
  return <div data-testid='InterpretationContextTester'></div>
}

describe('InterpretationContext', () => {
  it('should create a context', () => {
    render(
      <InterpretationContextProvider>
          <InterpretationContextTester />
      </InterpretationContextProvider>
    )
    const tester = screen.getByTestId('InterpretationContextTester')
    expect(tester).toBeInTheDocument()
  })

  describe('connect', () => {

  })

  describe('setConnected', () => {

  })

  describe('disconnect', () => {

  })

  describe('changeLanguage', () => {

  })

  describe('changeDirection', () => {

  })

  describe('changeMute', () => {

  })

  describe('changeVolume', () => {

  })

  describe('minimize', () => {

  })
})
