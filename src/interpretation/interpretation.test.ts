import { ClientCallType } from '@pexip/infinity'
import type { Language } from '../language'
import { type ConnectRequest, Interpretation } from './interpretation'
import { Role } from '../types/Role'

// Create a mocks
require('../__mocks__/mediaDevices')

const mockCall = jest.fn()
jest.mock('@pexip/infinity', () => {
  return {
    ClientCallType: {
      AudioRecvOnly: 0,
      AudioSendOnly: 1
    },
    createInfinityClientSignals: jest.fn(() => ({
      onAuthenticatedWithConference: { add: jest.fn() },
      onError: { add: jest.fn() },
      onPinRequired: { add: jest.fn() }
    })),
    createCallSignals: jest.fn(() => ({
      onRemoteStream: { add: jest.fn() }
    })),
    createInfinityClient: jest.fn(() => ({
      call: (params: any) => { mockCall(params) }
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

const language: Language = {
  code: '0034',
  name: 'Spanish'
}

describe('Interpretation', () => {
  beforeEach(() => {
    mockCall.mockClear()
  })

  describe('connect', () => {
    describe('role=interpreter', () => {
      it('should trigger infinity call with the correct parameters', async () => {
        const request: ConnectRequest = {
          language,
          role: Role.Interpreter
        }
        await Interpretation.connect(request)
        const mainRoom = undefined
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
        const mainRoom = undefined
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
  })
  describe('setAudioMutedDevice', () => {
  })
  describe('getAudioInputDevice', () => {
  })
  describe('changeDirection', () => {
  })
  describe('leave', () => {
  })
})
