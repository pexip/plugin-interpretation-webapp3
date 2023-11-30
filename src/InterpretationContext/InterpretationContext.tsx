import React, { createContext, useContext, useMemo, useReducer } from 'react'
import type { InterpretationState } from './InterpretationState'
import { Direction } from '../types/Direction'
import type { Language } from '../types/Language'
import { interpretationReducer } from './interpretationReducer'
import { config } from '../config'
import { InterpretationActionType } from './InterpretationAction'
import {
  type InfinitySignals,
  createCallSignals,
  createInfinityClient,
  createInfinityClientSignals,
  type CallSignals,
  ClientCallType
} from '@pexip/infinity'
import { showErrorPrompt } from '../prompts'
import { showPinForm } from '../forms'
import { Role } from '../types/Role'
import { MainRoomVolume } from '../main-room/volume'
import { MainRoomMuteButtons } from '../main-room/mute-buttons'
import { MainRoomMediaConstraints } from '../main-room/media-constraints'
import { getPlugin } from '../plugin'
import { getUser } from '../user'
import { getMainConferenceAlias } from '../conference'

const InterpretationContext = createContext<InterpretationContextType | null>(null)

const initialState: InterpretationState = {
  role: config.role,
  connected: false,
  language: null,
  direction: Direction.MainRoomToInterpretation,
  muted: true,
  volume: 1,
  minimized: false
}

export interface InterpretationContextType {
  connect: (language: Language, pin?: string) => Promise<void>
  setConnected: () => void
  disconnect: () => Promise<void>
  changeLanguage: (language: Language) => Promise<void>
  changeDirection: (direction: Direction) => Promise<void>
  changeMute: (muted: boolean) => void
  changeVolume: (volue: number) => Promise<void>
  minimize: (minimized: boolean) => void
  state: InterpretationState
}

export const InterpretationContextProvider = (props: {
  children?: JSX.Element
}): JSX.Element => {
  const [state, dispatch] = useReducer(interpretationReducer, initialState)

  const clientSignals = createInfinityClientSignals([])
  const callSignals = createCallSignals([])
  const infinityClient = createInfinityClient(clientSignals, callSignals)
  const audio: HTMLAudioElement = new Audio()

  const initializeInfinityClientSignals = (signals: InfinitySignals): void => {
    signals.onPinRequired.add(async ({ hasHostPin, hasGuestPin }) => {
      const role = config.role
      if (role === Role.Interpreter && hasHostPin) {
        await showPinForm()
      }
      if (role === Role.Listener) {
        if (hasGuestPin) {
          await showPinForm()
        } else {
          if (state.language != null && role != null) {
            const pin = ''
            await interpretationContextValue.connect(state.language, pin)
          }
        }
      }
    })

    signals.onAuthenticatedWithConference.add(async () => {
      dispatch({
        type: InterpretationActionType.Connected
      })
    })

    signals.onError.add(async ({ error, errorCode }): Promise<void> => {
      await showErrorPrompt(error)
    })
  }

  const initializeInfinityCallSignals = (signals: CallSignals): void => {
    signals.onRemoteStream.add(async (stream) => {
      audio.autoplay = true
      audio.srcObject = stream
    })
  }

  initializeInfinityClientSignals(clientSignals)
  initializeInfinityCallSignals(callSignals)

  let mediaStream: MediaStream | undefined

  const connect = async (language: Language, pin?: string): Promise<void> => {
    const username = getUser().displayName ?? getUser().uuid
    let roleTag: string
    let callType: ClientCallType

    dispatch({
      type: InterpretationActionType.Connecting,
      body: {
        language
      }
    })

    if (state.role === Role.Interpreter) {
      roleTag = 'Interpreter'
      mediaStream = await getMediaStream()
      callType = ClientCallType.AudioSendOnly
    } else {
      roleTag = 'Listener'
      mediaStream = undefined
      callType = ClientCallType.AudioRecvOnly
    }

    const displayName = `${username} - ${roleTag}`

    try {
      const conferenceAlias = getMainConferenceAlias() + language.code
      const bandwidth = 0
      if (pin != null) {
        await infinityClient.call({
          conferenceAlias,
          displayName,
          callType,
          bandwidth,
          mediaStream,
          pin
        })
      } else {
        await infinityClient.call({
          conferenceAlias,
          displayName,
          callType,
          bandwidth,
          mediaStream
        })
        console.log('Connecting')
      }
    } catch (e) {
      stopStream(mediaStream)
      throw e
    }

    MainRoomMuteButtons.disable(true)
  }

  const setConnected = (): void => {
    dispatch({
      type: InterpretationActionType.Connected
    })
  }

  const disconnect = async (): Promise<void> => {
    await infinityClient.disconnect({ reason: 'User initiated disconnect' })
    audio.pause()
    MainRoomVolume.set(1)
    MainRoomMuteButtons.disable(false)
    dispatch({
      type: InterpretationActionType.Disconnected
    })
  }

  const changeLanguage = async (language: Language): Promise<void> => {
    dispatch({
      type: InterpretationActionType.ChangedLanguage,
      body: {
        language
      }
    })
  }

  const changeDirection = async (direction: Direction): Promise<void> => {
    dispatch({
      type: InterpretationActionType.ChangedDirection,
      body: {
        direction
      }
    })
  }

  const changeMute = (muted: boolean): void => {
    dispatch({
      type: InterpretationActionType.ChangedMute,
      body: {
        muted
      }
    })
  }

  const changeVolume = async (): Promise<void> => {
    await Promise.resolve()
  }

  const minimize = (minimized: boolean): void => {
    dispatch({
      type: InterpretationActionType.Minimize,
      body: {
        minimized
      }
    })
  }

  const getMediaStream = async (deviceId?: string): Promise<MediaStream> => {
    let stream: MediaStream

    const mainRoomConstraints = MainRoomMediaConstraints.get()
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: mainRoomConstraints?.audio ?? true,
        video: false
      })
      const audioTracks = stream.getAudioTracks()
      console.log('Using audio device: ' + audioTracks[0].label)
    } catch (e) {
      console.error(e)
      const plugin = getPlugin()
      await plugin.ui.showToast({ message: 'Interpretation cannot access the microphone' })
      throw e
    }
    return stream
  }

  const stopStream = (stream: MediaStream | undefined): void => {
    stream?.getTracks().forEach((track) => { track.stop() })
  }

  const interpretationContextValue = useMemo(
    () => ({
      connect,
      setConnected,
      disconnect,
      changeLanguage,
      changeDirection,
      changeMute,
      changeVolume,
      minimize,
      state
    }),
    [state]
  )

  return (
    <InterpretationContext.Provider value={interpretationContextValue}>
      {props.children}
    </InterpretationContext.Provider>
  )
}

export const useInterpretationContext = (): InterpretationContextType => {
  const interpretationContext = useContext(InterpretationContext)
  if (interpretationContext === null) {
    throw new Error(
      'useInterpretationContext has to be used within <InterpretationContext.Provider>'
    )
  }
  return interpretationContext
}
