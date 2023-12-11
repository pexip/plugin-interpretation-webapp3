import React from 'react'
import { InterpretationContextProvider, useInterpretationContext } from './InterpretationContext'
import { act, fireEvent, render, screen } from '@testing-library/react'
import type { Language } from '../types/Language'
import { Direction } from '../types/Direction'
import { ClientCallType } from '@pexip/infinity'
import { config } from '../config'
import { Role } from '../types/Role'

require('../__mocks__/mediaDevices')

const pauseStub = jest
  .spyOn(window.HTMLMediaElement.prototype, 'pause')
  .mockImplementation(() => {})

jest.mock('../config', () => ({
  config: {
    role: 'interpreter',
    mainFloorVolume: 80
  }
}))

jest.mock('../user', () => ({
  getUser: () => ({
    displayName: 'user-display-name'
  })
}))

const french: Language = {
  code: '0033',
  name: 'french'
}

const spanish: Language = {
  code: '0034',
  name: 'spanish'
}

const mockGetMediaConstraints = jest.fn()
const mockSetMute = jest.fn()
const mockIsMuted = jest.fn()
const mockDisableMute = jest.fn()
const mockSetVolume = jest.fn()
const mockRefreshVolume = jest.fn()
jest.mock('../main-room', () => ({
  MainRoom: {
    getMediaConstraints: () => mockGetMediaConstraints(),
    setMute: (muted: boolean) => mockSetMute(muted),
    isMuted: () => mockIsMuted(),
    disableMute: (disabled: boolean) => mockDisableMute(disabled),
    setVolume: (volume: number) => mockSetVolume(volume),
    refreshVolume: () => mockRefreshVolume()
  }
}))

const mockCall = jest.fn()
const mockMute = jest.fn()
const mockSetStream = jest.fn()
const mockDisconnect = jest.fn()

let protectedByPin = true
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
        if (!protectedByPin) {
          onAuthenticatedWithConferenceCallback()
        }
      },
      mute: (params: any) => { mockMute(params) },
      setStream: (params: any) => { mockSetStream(params) },
      disconnect: (params: any) => { mockDisconnect(params) }
    }))
  }
}, { virtual: true })

const InterpretationContextTester = (): JSX.Element => {
  const {
    connect,
    setConnected,
    disconnect,
    changeLanguage,
    changeDirection,
    changeMute,
    changeVolume,
    minimize,
    state
  } = useInterpretationContext()
  const { role, connected, language, direction, muted, volume, minimized } = state
  return (
    <div data-testid='InterpretationContextTester'>
      <span data-testid='role'>{role}</span>
      <span data-testid='connected'>{connected.toString()}</span>
      <span data-testid='language'>{JSON.stringify(language)}</span>
      <span data-testid='direction'>{direction}</span>
      <span data-testid='muted'>{muted.toString()}</span>
      <span data-testid='volume'>{volume}</span>
      <span data-testid='minimized'>{minimized.toString()}</span>
      <button data-testid='connect' onClick={() => { connect(french).catch((e) => { console.error(e) }) }} />
      <button data-testid='setConnected' onClick={() => { setConnected() }} />
      <button data-testid='disconnect' onClick={() => { disconnect().catch((e) => { console.error(e) }) }} />
      <button data-testid='changeLanguage' onClick={() => { changeLanguage(spanish).catch((e) => { console.error(e) }) }} />
      <button data-testid='changeDirection' onClick={() => { changeDirection(Direction.InterpretationToMainRoom).catch((e) => { console.error(e) }) }} />
      <button data-testid='changeMute' onClick={() => { changeMute(true) }} />
      <button data-testid='changeVolume' onClick={() => { changeVolume(70) }} />
      <button data-testid='minimize' onClick={() => { minimize(true) }} />
    </div>
  )
}

describe('InterpretationContext', () => {
  beforeEach(() => {
    mockGetMediaConstraints.mockClear()
    mockSetMute.mockClear()
    mockIsMuted.mockClear()
    mockDisableMute.mockClear()
    mockSetVolume.mockClear()
    mockRefreshVolume.mockClear()
    mockCall.mockClear()
    mockMute.mockClear()
    mockSetStream.mockClear()
    mockDisconnect.mockClear()
    pauseStub.mockClear()
  })

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
    describe('interpreter', () => {
      beforeEach(async () => {
        config.role = Role.Interpreter
        render(
          <InterpretationContextProvider>
            <InterpretationContextTester />
          </InterpretationContextProvider>
        )
        await act(async () => {
          const button = screen.getByTestId('connect')
          fireEvent.click(button)
        })
      })

      it('should disable the main room mute', async () => {
        expect(mockDisableMute).toHaveBeenCalledTimes(1)
        expect(mockDisableMute).toHaveBeenCalledWith(true)
      })

      it('should use callType=AudioSendOnly', async () => {
        expect(mockCall).toHaveBeenCalledTimes(1)
        expect(mockCall).toHaveBeenCalledWith(
          expect.objectContaining({
            callType: ClientCallType.AudioSendOnly
          })
        )
      })

      it('should add " - Interpreter" at the end of the displayName', async () => {
        expect(mockCall).toHaveBeenCalledTimes(1)
        expect(mockCall).toHaveBeenCalledWith(
          expect.objectContaining({
            displayName: 'user-display-name - Interpreter'
          })
        )
      })

      it('should pass a mediaStream', async () => {
        expect(mockCall).toHaveBeenCalledTimes(1)
        expect(mockCall).toHaveBeenCalledWith(
          expect.objectContaining({
            mediaStream: expect.objectContaining({
              active: true
            })
          })
        )
      })
    })

    describe('listener', () => {
      beforeEach(async () => {
        config.role = Role.Listener
        render(
          <InterpretationContextProvider>
            <InterpretationContextTester />
          </InterpretationContextProvider>
        )
        await act(async () => {
          const button = screen.getByTestId('connect')
          fireEvent.click(button)
        })
      })

      it('shouldn\'t disable the main room mute', async () => {
        expect(mockDisableMute).not.toHaveBeenCalled()
      })

      it('should use callType=AudioRecvOnly', async () => {
        expect(mockCall).toHaveBeenCalledTimes(1)
        expect(mockCall).toHaveBeenCalledWith(
          expect.objectContaining({
            callType: ClientCallType.AudioRecvOnly
          })
        )
      })

      it('should add " - Listener" at the end of the displayName', async () => {
        expect(mockCall).toHaveBeenCalledTimes(1)
        expect(mockCall).toHaveBeenCalledWith(
          expect.objectContaining({
            displayName: 'user-display-name - Listener'
          })
        )
      })

      it('should\'t pass a mediaStream', async () => {
        expect(mockCall).toHaveBeenCalledTimes(1)
        expect(mockCall).toHaveBeenCalledWith(
          expect.objectContaining({
            mediaStream: undefined
          })
        )
      })
    })

    describe('unprotected by pin', () => {
      beforeAll(async () => {
        protectedByPin = true
        render(
          <InterpretationContextProvider>
            <InterpretationContextTester />
          </InterpretationContextProvider>
        )
        await act(async () => {
          const button = screen.getByTestId('connect')
          fireEvent.click(button)
        })
      })

      it('should set the correct states', async () => {
        const expectedConnected = false
        const expectedLanguage = french
        const expectedVolume = 80
        const expectedDirection = Direction.MainRoomToInterpretation

        const connected = screen.getByTestId('connected')
        expect(connected.innerHTML).toBe(expectedConnected.toString())
        const language = screen.getByTestId('language')
        expect(language.innerHTML).toBe(JSON.stringify(expectedLanguage))
        const volume = screen.getByTestId('volume')
        expect(volume.innerHTML).toBe(expectedVolume.toString())
        const direction = screen.getByTestId('direction')
        expect(direction.innerHTML).toBe(expectedDirection)
      })
    })

    describe('protected by pin', () => {
      beforeAll(async () => {
        protectedByPin = false
        render(
          <InterpretationContextProvider>
            <InterpretationContextTester />
          </InterpretationContextProvider>
        )
        await act(async () => {
          const button = screen.getByTestId('connect')
          fireEvent.click(button)
        })
      })

      it('should set the correct states', async () => {
        const expectedConnected = true
        const expectedLanguage = french
        const expectedVolume = 80
        const expectedDirection = Direction.MainRoomToInterpretation

        const connected = screen.getByTestId('connected')
        expect(connected.innerHTML).toBe(expectedConnected.toString())
        const language = screen.getByTestId('language')
        expect(language.innerHTML).toBe(JSON.stringify(expectedLanguage))
        const volume = screen.getByTestId('volume')
        expect(volume.innerHTML).toBe(expectedVolume.toString())
        const direction = screen.getByTestId('direction')
        expect(direction.innerHTML).toBe(expectedDirection)
      })
    })
  })

  describe('setConnected', () => {
    beforeEach(async () => {
      render(
        <InterpretationContextProvider>
          <InterpretationContextTester />
        </InterpretationContextProvider>
      )
      await act(async () => {
        const button = screen.getByTestId('setConnected')
        fireEvent.click(button)
      })
    })

    it('should change the state to connected', () => {
      const connected = screen.getByTestId('connected')
      expect(connected.innerHTML).toBe('true')
    })
  })

  describe('disconnect', () => {
    beforeEach(async () => {
      render(
        <InterpretationContextProvider>
          <InterpretationContextTester />
        </InterpretationContextProvider>
      )
      await act(async () => {
        const buttonSetConnected = screen.getByTestId('setConnected')
        fireEvent.click(buttonSetConnected)
        const buttonDisconnect = screen.getByTestId('disconnect')
        fireEvent.click(buttonDisconnect)
      })
    })

    it('should change the state to disconnected', async () => {
      const connected = screen.getByTestId('connected')
      expect(connected.innerHTML).toBe('false')
    })

    it('should pause the audio', async () => {
      expect(pauseStub).toHaveBeenCalledTimes(1)
    })

    it('should call infinityClient.disconnect', () => {
      expect(mockDisconnect).toHaveBeenCalledTimes(1)
      expect(mockDisconnect).toHaveBeenCalledWith({ reason: 'User initiated disconnect' })
    })

    it('should set the volume in the main room to 1', () => {
      expect(mockSetVolume).toHaveBeenCalledTimes(1)
      expect(mockSetVolume).toHaveBeenCalledWith(1)
    })

    it('should enable the mute buttons', () => {
      expect(mockDisableMute).toHaveBeenCalledTimes(1)
      expect(mockDisableMute).toHaveBeenCalledWith(false)
    })
  })

  describe('changeLanguage', () => {
    beforeEach(async () => {
      render(
        <InterpretationContextProvider>
          <InterpretationContextTester />
        </InterpretationContextProvider>
      )
    })

    it('should have the default language to null', () => {
      const language = screen.getByTestId('language')
      expect(language.innerHTML).toBe('null')
    })

    it('should have the default language to "spanish"', async () => {
      const button = screen.getByTestId('changeLanguage')
      await act(async () => {
        fireEvent.click(button)
      })
      const language = screen.getByTestId('language')
      expect(language.innerHTML).toBe(JSON.stringify(spanish))
    })
  })

  describe('changeDirection', () => {
    beforeEach(async () => {
      render(
        <InterpretationContextProvider>
          <InterpretationContextTester />
        </InterpretationContextProvider>
      )
    })

    it('should have the default direction to "MainRoomToInterpretation"', () => {
      const language = screen.getByTestId('direction')
      expect(language.innerHTML).toBe(Direction.MainRoomToInterpretation)
    })

    it('should have change the direction to "InterpretationToMainRoom"', async () => {
      const button = screen.getByTestId('changeDirection')
      await act(async () => {
        fireEvent.click(button)
      })
      const language = screen.getByTestId('direction')
      expect(language.innerHTML).toBe(Direction.InterpretationToMainRoom)
    })
  })

  describe('changeMute', () => {
    beforeEach(async () => {
      render(
        <InterpretationContextProvider>
          <InterpretationContextTester />
        </InterpretationContextProvider>
      )
    })

    it('should be unmuted by default', () => {
      const muted = screen.getByTestId('muted')
      expect(muted.innerHTML).toBe('false')
    })

    it('should be muted when clicked', async () => {
      const button = screen.getByTestId('changeMute')
      await act(async () => {
        fireEvent.click(button)
      })
      const muted = screen.getByTestId('muted')
      expect(muted.innerHTML).toBe('true')
    })
  })

  describe('changeVolume', () => {
    beforeEach(async () => {
      render(
        <InterpretationContextProvider>
          <InterpretationContextTester />
        </InterpretationContextProvider>
      )
    })

    it('should get the default value from the config file', () => {
      const volume = screen.getByTestId('volume')
      expect(volume.innerHTML).toBe('80')
    })

    it('should change the volume when clicked', async () => {
      const button = screen.getByTestId('changeVolume')
      await act(async () => {
        fireEvent.click(button)
      })
      const volume = screen.getByTestId('volume')
      expect(volume.innerHTML).toBe('70')
    })
  })

  describe('minimize', () => {
    beforeEach(async () => {
      render(
        <InterpretationContextProvider>
          <InterpretationContextTester />
        </InterpretationContextProvider>
      )
    })

    it('should be not be minimized by default', () => {
      const minimized = screen.getByTestId('minimized')
      expect(minimized.innerHTML).toBe('false')
    })

    it('should be minimized when clicked', async () => {
      const button = screen.getByTestId('minimize')
      await act(async () => {
        fireEvent.click(button)
      })
      const minimized = screen.getByTestId('minimized')
      expect(minimized.innerHTML).toBe('true')
    })
  })
})
