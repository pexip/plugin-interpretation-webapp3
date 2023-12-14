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
  ClientCallType,
  type InfinityClient
} from '@pexip/infinity'
import { showErrorPrompt } from '../prompts'
import { showPinForm } from '../forms'
import { Role } from '../types/Role'
import { getPlugin } from '../plugin'
import { getUser } from '../user'
import { getMainConferenceAlias } from '../conference'
import { MainRoom } from '../main-room'
import { setButtonActive } from '../button'

const InterpretationContext = createContext<InterpretationContextType | null>(null)

export interface InterpretationContextType {
  connect: (language: Language, pin?: string) => Promise<void>
  disconnect: () => Promise<void>
  changeLanguage: (language: Language) => Promise<void>
  changeDirection: (direction: Direction) => Promise<void>
  changeMute: (muted: boolean) => Promise<void>
  changeVolume: (volume: number) => void
  minimize: (minimized: boolean) => void
  state: InterpretationState
}

const clientSignals = createInfinityClientSignals([])
const callSignals = createCallSignals([])
let infinityClient: InfinityClient
const audio: HTMLAudioElement = new Audio()

export const InterpretationContextProvider = (props: {
  children?: JSX.Element
}): JSX.Element => {
  const initialState: InterpretationState = {
    role: config.role,
    connected: false,
    language: null,
    direction: Direction.MainRoomToInterpretation,
    muted: false,
    volume: config.mainFloorVolume,
    minimized: false
  }

  const [state, dispatch] = useReducer(interpretationReducer, initialState)

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
            await connect(state.language, pin)
          }
        }
      }
    })

    signals.onAuthenticatedWithConference.add(async () => {
      await handleConnected()
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

  let mediaStream: MediaStream | undefined

  const connect = async (language: Language, pin?: string): Promise<void> => {
    infinityClient = createInfinityClient(clientSignals, callSignals)
    initializeInfinityClientSignals(clientSignals)
    initializeInfinityCallSignals(callSignals)

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
      }
    } catch (e) {
      stopStream(mediaStream)
      throw e
    }
  }

  const disconnect = async (): Promise<void> => {
    await infinityClient.disconnect({ reason: 'User initiated disconnect' })
    audio.pause()
    MainRoom.setVolume(1)
    MainRoom.disableMute(false)
    MainRoom.setMute(state.muted)
    await setButtonActive(false)
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
    if (direction === Direction.MainRoomToInterpretation) {
      MainRoom.setMute(true)
      await infinityClient.mute({ mute: state.muted })
    } else {
      MainRoom.setMute(state.muted)
      await infinityClient.mute({ mute: true })
    }
    dispatch({
      type: InterpretationActionType.ChangedDirection,
      body: {
        direction
      }
    })
  }

  const changeMute = async (muted: boolean): Promise<void> => {
    if (state.direction === Direction.MainRoomToInterpretation) {
      await infinityClient.mute({ mute: muted })
    } else {
      MainRoom.setMute(muted)
    }

    dispatch({
      type: InterpretationActionType.ChangedMute,
      body: {
        muted
      }
    })
  }

  const changeVolume = (volume: number): void => {
    dispatch({
      type: InterpretationActionType.ChangedVolume,
      body: {
        volume
      }
    })
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
    const constraints = MainRoom.getMediaConstraints()
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: constraints?.audio ?? true,
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

  const handleConnected = async (): Promise<void> => {
    if (state.role === Role.Interpreter) {
      if (MainRoom.isMuted()) {
        await changeMute(true)
      } else {
        MainRoom.setMute(true)
      }
      MainRoom.disableMute(true)
    }

    await setButtonActive(true)
    dispatch({
      type: InterpretationActionType.Connected
    })
  }

  const interpretationContextValue = useMemo(
    () => ({
      connect,
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
