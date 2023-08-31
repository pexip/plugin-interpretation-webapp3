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
import { Role } from './role'

const deviceIdStorageKey = 'PexInterpretation:deviceId'

const clientSignals = createInfinityClientSignals([])
const callSignals = createCallSignals([])
const infinityClient = createInfinityClient(clientSignals, callSignals)
const audio: HTMLAudioElement = new Audio()

let handleChangeCallback: (language: Language | null) => void
let currentLanguage: Language | null = null
let signalsInitialized: boolean = false
let stream: MediaStream

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
  stream = await getMediaStream()
  try {
    await infinityClient.call({
      conferenceAlias: getMainConferenceAlias() + language.code,
      callType: role === Role.Interpreter ? ClientCallType.Audio : ClientCallType.Audio,
      bandwidth: 0,
      displayName: (getUser().displayName ?? getUser().uuid) + ' - Interpreter',
      mediaStream: stream,
      pin
    })
  } catch (e) {
    stopStream(stream)
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
  stopStream(stream)
  stream = await getMediaStream(deviceId)
  infinityClient.setStream(stream)
}

const leave = async (): Promise<void> => {
  await infinityClient.disconnect({ reason: 'User initiated disconnect' })
  currentLanguage = null
  handleChangeCallback(null)
  audio.pause()
}

const initializeInfinityClientSignals = (signals: InfinitySignals): void => {
  signals.onPinRequired.add(async ({ hasHostPin, hasGuestPin }) => {
    if (hasHostPin) {
      await showPinForm()
    }
  })
  signals.onMe.add(() => {
    handleChangeCallback(currentLanguage)
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

const stopStream = (stream: MediaStream): void => {
  stream.getTracks().forEach((track) => { track.stop() })
}

export const Interpretation = {
  registerOnChangeLanguageCallback,
  join,
  setAudioMuted,
  setAudioInputDevice,
  getCurrentLanguage,
  leave
}
