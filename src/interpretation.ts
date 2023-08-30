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

const clientSignals = createInfinityClientSignals([])
const callSignals = createCallSignals([])
const infinityClient = createInfinityClient(clientSignals, callSignals)

let handleChangeCallback: (language: Language | null) => void
let currentLanguage: Language | null = null
let signalsInitialized: boolean = false
const audio: HTMLAudioElement = new Audio()

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
  const audioStream = await getMediaStream()
  try {
    await infinityClient.call({
      conferenceAlias: getMainConferenceAlias() + language.code,
      callType: role === Role.Interpreter ? ClientCallType.Audio : ClientCallType.Audio,
      bandwidth: 0,
      displayName: (getUser().displayName ?? getUser().uuid) + ' - Interpreter',
      mediaStream: audioStream,
      pin
    })
  } catch (e) {
    audioStream.getTracks().forEach((track) => { track.stop() })
    throw e
  }
}

const getCurrentLanguage = (): Language | null => {
  return currentLanguage
}

const setAudioMuted = async (mute: boolean): Promise<void> => {
  await infinityClient.mute({ mute })
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
    console.log(audio)
  })
}

const getMediaStream = async (): Promise<MediaStream> => {
  let stream: MediaStream
  try {
    // TODO: Implement media selector
    const devices = await navigator.mediaDevices.enumerateDevices()
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: devices[1].deviceId
      },
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

export const Interpretation = {
  registerOnChangeLanguageCallback,
  join,
  setAudioMuted,
  getCurrentLanguage,
  leave
}
