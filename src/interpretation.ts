import {
  ClientCallType,
  type InfinitySignals,
  createCallSignals,
  createInfinityClient,
  createInfinityClientSignals,
  type CallSignals
} from '@pexip/infinity'
import type { Language } from './language'
import { showPinForm } from './forms'
import { getPlugin } from './plugin'
import { config } from './config'
import { getMainConferenceAlias } from './conference'
import { getUser } from './user'
import { Role } from './types/Role'
import { showErrorPrompt } from './prompts'

const deviceIdStorageKey = 'PexInterpretation:deviceId'

const clientSignals = createInfinityClientSignals([])
const callSignals = createCallSignals([])
const infinityClient = createInfinityClient(clientSignals, callSignals)
const audio: HTMLAudioElement = new Audio()

let handleChangeCallback: (language: Language | null) => void
let currentLanguage: Language | null = null
let signalsInitialized: boolean = false
let mediaStream: MediaStream | undefined

const registerOnChangeLanguageCallback = (callback: (language: Language | null) => void): void => {
  handleChangeCallback = callback
}

const join = async (language: Language, pin?: string): Promise<void> => {
  currentLanguage = language
  if (!signalsInitialized) {
    initializeInfinityClientSignals(clientSignals)
    initializeInfinityCallSignals(callSignals)
    signalsInitialized = true
  }

  const role = config.role
  const username = getUser().displayName ?? getUser().uuid
  let roleTag: string
  let callType: ClientCallType

  if (role === Role.Interpreter) {
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
    await infinityClient.call({
      conferenceAlias: getMainConferenceAlias() + language.code,
      bandwidth: 0,
      callType,
      displayName,
      mediaStream,
      pin
    })
  } catch (e) {
    stopStream(mediaStream)
    throw e
  }
}

const getCurrentLanguage = (): Language | null => {
  return currentLanguage
}

const setAudioMuted = async (mute: boolean): Promise<void> => {
  await infinityClient.mute({ mute })
}

const setAudioInputDevice = async (deviceId: string): Promise<void> => {
  localStorage.setItem(deviceIdStorageKey, deviceId)
  stopStream(mediaStream)
  mediaStream = await getMediaStream(deviceId)
  infinityClient.setStream(mediaStream)
}

const getAudioInputDevice = (): string | null => {
  return localStorage.getItem(deviceIdStorageKey)
}

const leave = async (): Promise<void> => {
  await infinityClient.disconnect({ reason: 'User initiated disconnect' })
  currentLanguage = null
  handleChangeCallback(null)
  audio.pause()
}

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
        if (currentLanguage != null) {
          const pin = ' '
          await join(currentLanguage, pin)
        }
      }
    }
    // TODO: What to do when no PIN for guest
  })
  signals.onMe.add(async () => {
    handleChangeCallback(currentLanguage)
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

const getMediaStream = async (deviceId?: string): Promise<MediaStream> => {
  let stream: MediaStream
  if (deviceId == null) {
    deviceId = localStorage.getItem(deviceIdStorageKey) ?? undefined
  }
  const audio = deviceId != null ? { deviceId } : true
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio,
      video: false
    })
    const audioTracks = stream.getAudioTracks()
    console.log('Using audio device: ' + audioTracks[0].label)
  } catch (e) {
    const plugin = getPlugin()
    await plugin.ui.showToast({ message: 'Interpretation cannot access the microphone' })
    throw e
  }
  return stream
}

const stopStream = (stream: MediaStream | undefined): void => {
  stream?.getTracks().forEach((track) => { track.stop() })
}

export const Interpretation = {
  registerOnChangeLanguageCallback,
  join,
  setAudioMuted,
  setAudioInputDevice,
  getAudioInputDevice,
  getCurrentLanguage,
  leave
}
