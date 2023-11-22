import { ClientCallType } from '@pexip/infinity'
import type { Language } from '../types/Language'
import { type ConnectRequest, Interpretation } from './interpretation'
import { Role } from '../types/Role'
import { testDevices } from '../__mocks__/mediaDevices'
import { mockLocalStorage } from '../__mocks__/mockLocalStorage'
import { Direction } from '../types/Direction'

// Create a mocks
require('../__mocks__/mediaDevices');
(window as any).localStorage = mockLocalStorage

const mockCall = jest.fn()
const mockMute = jest.fn()
const mockSetStream = jest.fn()
const mockDisconnect = jest.fn()
const mockChangeCallback = jest.fn()

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

const uuid = 'my-uuid'
const displayName = 'my-display-name'
jest.mock('../user', () => ({
  getUser: jest.fn(() => ({
    uuid,
    displayName
  }))
}))

jest.mock('../config', () => ({
  config: jest.fn()
}))

const mainRoom = 'main-room'
jest.mock('../conference', () => ({
  getMainConferenceAlias: () => mainRoom
}))

const language: Language = {
  code: '0034',
  name: 'Spanish'
}

describe('Interpretation', () => {
  beforeEach(() => {
    mockCall.mockClear()
    mockMute.mockClear()
    mockSetStream.mockClear()
    mockDisconnect.mockClear()
    mockChangeCallback.mockClear()
  })

  describe('registerOnChangeLanguageCallback', () => {
    it('should be called on connect with new parameters', async () => {
      const request: ConnectRequest = {
        language,
        role: Role.Listener
      }
      Interpretation.registerOnChangeLanguageCallback(mockChangeCallback)
      await Interpretation.connect(request)
      const expectedLanguage = language
      const expectedDirection = Direction.MainRoomToInterpretation
      expect(mockChangeCallback).toHaveBeenCalledTimes(1)
      expect(mockChangeCallback).toHaveBeenCalledWith(expectedLanguage, expectedDirection)
    })

    it('should be called on leave', async () => {
      Interpretation.registerOnChangeLanguageCallback(mockChangeCallback)
      await Interpretation.leave()
      const expectedLanguage = null
      const expectedDirection = Direction.MainRoomToInterpretation
      expect(mockChangeCallback).toHaveBeenCalledTimes(1)
      expect(mockChangeCallback).toHaveBeenCalledWith(expectedLanguage, expectedDirection)
    })
  })

  describe('connect', () => {
    describe('role=interpreter', () => {
      it('should trigger infinity call with the correct parameters', async () => {
        const request: ConnectRequest = {
          language,
          role: Role.Interpreter
        }
        await Interpretation.connect(request)
        const mediaStream = new MediaStream();
        (mediaStream as any).id = '1234'
        const expectedParameters = {
          conferenceAlias: `${mainRoom}${language.code}`,
          displayName: `${displayName} - Interpreter`,
          callType: ClientCallType.AudioSendOnly,
          bandwidth: 0,
          mediaStream: await navigator.mediaDevices.getUserMedia(),
          pin: undefined
        }
        expect(mockCall).toHaveBeenCalledTimes(1)
        expect(mockCall).toHaveBeenCalledWith(expectedParameters)
      })
    })

    describe('role=listener', () => {
      it('should trigger infinity call with the correct parameters', async () => {
        const request: ConnectRequest = {
          language,
          role: Role.Listener
        }
        await Interpretation.connect(request)
        const expectedParameters = {
          conferenceAlias: `${mainRoom}${language.code}`,
          displayName: `${displayName} - Listener`,
          callType: ClientCallType.AudioRecvOnly,
          bandwidth: 0,
          mediaStream: undefined,
          pin: undefined
        }
        expect(mockCall).toHaveBeenCalledTimes(1)
        expect(mockCall).toHaveBeenCalledWith(expectedParameters)
      })
    })
  })

  describe('setAudioMuted', () => {
    it('should deliver the mute value to the infinite package', async () => {
      await Interpretation.setAudioMuted(true)
      expect(mockMute).toHaveBeenCalledTimes(1)
      expect(mockMute).toHaveBeenCalledWith({ mute: true })
    })

    it('should deliver the unmute value to the infinite package', async () => {
      await Interpretation.setAudioMuted(false)
      expect(mockMute).toHaveBeenCalledTimes(1)
      expect(mockMute).toHaveBeenCalledWith({ mute: false })
    })
  })

  describe('setAudioInputDevice', () => {
    it('should save the deviceId in the local storage', async () => {
      const deviceId = testDevices[0].deviceId
      await Interpretation.setAudioInputDevice(deviceId)
      const savedDeviceId = localStorage.getItem('PexInterpretation:deviceId')
      expect(savedDeviceId).toBe(deviceId)
    })
    it('should obtain a new mediaStream with the deviceId', async () => {
      const expectedDeviceId = testDevices[1].deviceId
      await Interpretation.setAudioInputDevice(expectedDeviceId)
      const audioTracks = (window as any).currentAudioTracks
      const deviceId = audioTracks[0].deviceId
      expect(deviceId).toBe(expectedDeviceId)
    })
  })

  describe('getAudioInputDevice', () => {
    it('should retrieve tha deviceId from localStorage', () => {
      const expectedDeviceId = testDevices[0].deviceId
      localStorage.setItem('PexInterpretation:deviceId', expectedDeviceId)
      const deviceId = Interpretation.getAudioInputDevice()
      expect(deviceId).toBe(expectedDeviceId)
    })
  })

  describe('getCurrentLanguage', () => {
    it('should return the current language', async () => {
      const request: ConnectRequest = {
        language,
        role: Role.Listener
      }
      Interpretation.registerOnChangeLanguageCallback(mockChangeCallback)
      await Interpretation.connect(request)
      const currentLanguage = Interpretation.getCurrentLanguage()
      expect(currentLanguage).toStrictEqual(request.language)
    })
  })

  describe('leave', () => {
    it('should call the infinity package with the reason "User initiated disconnected"', async () => {
      const request: ConnectRequest = {
        language,
        role: Role.Listener
      }
      Interpretation.registerOnChangeLanguageCallback(mockChangeCallback)
      await Interpretation.connect(request)
      await Interpretation.leave()
      expect(mockDisconnect).toHaveBeenCalledTimes(1)
      expect(mockDisconnect).toHaveBeenCalledWith({ reason: 'User initiated disconnect' })
    })

    it('should clear the currentLanguage', async () => {
      const request: ConnectRequest = {
        language,
        role: Role.Listener
      }
      Interpretation.registerOnChangeLanguageCallback(mockChangeCallback)
      await Interpretation.connect(request)
      await Interpretation.leave()
      const currentLanguage = Interpretation.getCurrentLanguage()
      expect(currentLanguage).toBe(null)
    })

    it('should call the callback with language=null', async () => {
      const request: ConnectRequest = {
        language,
        role: Role.Listener
      }
      Interpretation.registerOnChangeLanguageCallback(mockChangeCallback)
      await Interpretation.connect(request)
      await Interpretation.leave()
      expect(mockChangeCallback).toHaveBeenCalledTimes(2)
      const expectedLanguage = null
      const expectedDirection = Direction.MainRoomToInterpretation
      expect(mockChangeCallback).toHaveBeenCalledWith(expectedLanguage, expectedDirection)
    })

    it('should set the main room volume to 100%', async () => {
      const request: ConnectRequest = {
        language,
        role: Role.Listener
      }
      Interpretation.registerOnChangeLanguageCallback(mockChangeCallback)
      await Interpretation.connect(request)
      Interpretation.setMainRoomVolume(0.5)
      await Interpretation.leave()
      const volume = Interpretation.getMainRoomVolume()
      expect(volume).toBe(1)
    })
  })
})
