import React from 'react'
import { InterpretationContextProvider } from './InterpretationContext'
import { render, screen } from '@testing-library/react'

jest.mock('../config.ts', () => ({
  config: {
    role: 'interpreter'
  }
}))

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
})

// import { ClientCallType } from '@pexip/infinity'
// import type { Language } from '../types/Language'
// import { type ConnectRequest, Interpretation } from './interpretation'
// import { Role } from '../types/Role'
// import { mockLocalStorage } from '../__mocks__/mockLocalStorage'

// // Create a mocks
// require('../__mocks__/mediaDevices');
// (window as any).localStorage = mockLocalStorage

// const mockCall = jest.fn()
// const mockMute = jest.fn()
// const mockSetStream = jest.fn()
// const mockDisconnect = jest.fn()

// let onAuthenticatedWithConferenceCallback: () => void
// jest.mock('@pexip/infinity', () => {
//   return {
//     ClientCallType: {
//       AudioRecvOnly: 0,
//       AudioSendOnly: 1
//     },
//     createInfinityClientSignals: jest.fn(() => ({
//       onAuthenticatedWithConference: {
//         add: jest.fn((callback) => {
//           onAuthenticatedWithConferenceCallback = callback
//         })
//       },
//       onError: { add: jest.fn() },
//       onPinRequired: { add: jest.fn() }
//     })),
//     createCallSignals: jest.fn(() => ({
//       onRemoteStream: { add: jest.fn() }
//     })),
//     createInfinityClient: jest.fn(() => ({
//       call: (params: any) => {
//         mockCall(params)
//         onAuthenticatedWithConferenceCallback()
//       },
//       mute: (params: any) => { mockMute(params) },
//       setStream: (params: any) => { mockSetStream(params) },
//       disconnect: (params: any) => { mockDisconnect(params) }
//     }))
//   }
// }, { virtual: true })

// jest.mock('../main-room/media-constraints', () => ({
//   MainRoomMediaConstraints: {
//     get: jest.fn(),
//     emitter: jest.fn()
//   }
// }))

// const mockSetMainRoomVolume = jest.fn()
// jest.mock('../main-room/volume', () => ({
//   MainRoomVolume: {
//     set: (volume: number) => mockSetMainRoomVolume(volume)
//   }
// }))

// const uuid = 'my-uuid'
// const displayName = 'my-display-name'
// jest.mock('../user', () => ({
//   getUser: jest.fn(() => ({
//     uuid,
//     displayName
//   }))
// }))

// jest.mock('../config', () => ({
//   config: jest.fn()
// }))

// const mainRoom = 'main-room'
// jest.mock('../conference', () => ({
//   getMainConferenceAlias: () => mainRoom
// }))

// const pauseStub = jest
//   .spyOn(window.HTMLMediaElement.prototype, 'pause')
//   .mockImplementation(() => {})

// const language: Language = {
//   code: '0034',
//   name: 'Spanish'
// }

// describe('Interpretation', () => {
//   beforeEach(() => {
//     mockCall.mockClear()
//     mockMute.mockClear()
//     mockSetStream.mockClear()
//     mockDisconnect.mockClear()
//     mockSetMainRoomVolume.mockClear()
//     pauseStub.mockClear()
//   })

//   describe('emitter changed', () => {
//     it('should be called on connect with new parameters', async () => {
//       const mockChanged = jest.fn()
//       const request: ConnectRequest = {
//         language,
//         role: Role.Listener
//       }
//       Interpretation.emitter.on('changed', mockChanged)
//       await Interpretation.connect(request)
//       expect(mockChanged).toHaveBeenCalledTimes(1)
//     })

//     it('should be called on leave', async () => {
//       const mockChanged = jest.fn()
//       Interpretation.emitter.on('changed', mockChanged)
//       await Interpretation.leave()
//       expect(mockChanged).toHaveBeenCalledTimes(1)
//     })
//   })

//   describe('connect', () => {
//     describe('role=interpreter', () => {
//       it('should trigger infinity call with the correct parameters', async () => {
//         const request: ConnectRequest = {
//           language,
//           role: Role.Interpreter
//         }
//         await Interpretation.connect(request)
//         const mediaStream = new MediaStream();
//         (mediaStream as any).id = '1234'
//         const expectedParameters = {
//           conferenceAlias: `${mainRoom}${language.code}`,
//           displayName: `${displayName} - Interpreter`,
//           callType: ClientCallType.AudioSendOnly,
//           bandwidth: 0,
//           mediaStream: await navigator.mediaDevices.getUserMedia(),
//           pin: undefined
//         }
//         expect(mockCall).toHaveBeenCalledTimes(1)
//         expect(mockCall).toHaveBeenCalledWith(expectedParameters)
//       })
//     })

//     describe('role=listener', () => {
//       it('should trigger infinity call with the correct parameters', async () => {
//         const request: ConnectRequest = {
//           language,
//           role: Role.Listener
//         }
//         await Interpretation.connect(request)
//         const expectedParameters = {
//           conferenceAlias: `${mainRoom}${language.code}`,
//           displayName: `${displayName} - Listener`,
//           callType: ClientCallType.AudioRecvOnly,
//           bandwidth: 0,
//           mediaStream: undefined,
//           pin: undefined
//         }
//         expect(mockCall).toHaveBeenCalledTimes(1)
//         expect(mockCall).toHaveBeenCalledWith(expectedParameters)
//       })
//     })
//   })

//   describe('setAudioMuted', () => {
//     it('should deliver the mute value to the infinite package', async () => {
//       await Interpretation.setAudioMuted(true)
//       expect(mockMute).toHaveBeenCalledTimes(1)
//       expect(mockMute).toHaveBeenCalledWith({ mute: true })
//     })

//     it('should deliver the unmute value to the infinite package', async () => {
//       await Interpretation.setAudioMuted(false)
//       expect(mockMute).toHaveBeenCalledTimes(1)
//       expect(mockMute).toHaveBeenCalledWith({ mute: false })
//     })
//   })

//   describe('getLanguage', () => {
//     it('should return the current language', async () => {
//       const request: ConnectRequest = {
//         language,
//         role: Role.Listener
//       }
//       await Interpretation.connect(request)
//       const currentLanguage = Interpretation.getLanguage()
//       expect(currentLanguage).toStrictEqual(request.language)
//     })
//   })

//   describe('leave', () => {
//     it('should call the infinity package with the reason "User initiated disconnected"', async () => {
//       const request: ConnectRequest = {
//         language,
//         role: Role.Listener
//       }
//       await Interpretation.connect(request)
//       await Interpretation.leave()
//       expect(mockDisconnect).toHaveBeenCalledTimes(1)
//       expect(mockDisconnect).toHaveBeenCalledWith({ reason: 'User initiated disconnect' })
//     })

//     it('should clear the current language', async () => {
//       const request: ConnectRequest = {
//         language,
//         role: Role.Listener
//       }
//       await Interpretation.connect(request)
//       await Interpretation.leave()
//       const currentLanguage = Interpretation.getLanguage()
//       expect(currentLanguage).toBe(null)
//     })

//     it('should set the main room volume to 100%', async () => {
//       const request: ConnectRequest = {
//         language,
//         role: Role.Listener
//       }
//       await Interpretation.connect(request)
//       await Interpretation.leave()
//       expect(mockSetMainRoomVolume).toHaveBeenCalledTimes(1)
//       expect(mockSetMainRoomVolume).toHaveBeenCalledWith(1)
//     })

//     it('should pause the interpretation audio', async () => {
//       const request: ConnectRequest = {
//         language,
//         role: Role.Listener
//       }
//       await Interpretation.connect(request)
//       await Interpretation.leave()
//       expect(pauseStub).toHaveBeenCalledTimes(1)
//     })
//   })
// })
