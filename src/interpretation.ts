import {
  ClientCallType,
  type InfinitySignals,
  createCallSignals,
  createInfinityClient,
  createInfinityClientSignals
} from '@pexip/infinity'
import type { Language } from './language'
import { showPinForm } from './forms'
import { getPlugin } from './plugin'
import { config } from './config'
import { getMainConferenceAlias } from './conference'
import { getUser } from './user'
import { Role } from './role'

const infinityClientSignals = createInfinityClientSignals([])
const callSignals = createCallSignals([])
const infinityClient = createInfinityClient(infinityClientSignals, callSignals)

let handleChangeCallback: (language: Language | null) => void
let currentLanguage: Language | null = null
let signalsInitialized: boolean = false

const registerOnChangeLanguageCallback = (callback: (language: Language | null) => void): void => {
  handleChangeCallback = callback
}

const join = async (language: Language, pin?: string): Promise<void> => {
  currentLanguage = language
  if (!signalsInitialized) {
    initializeInfinityClientSignals(infinityClientSignals)
    signalsInitialized = true
  }
  const role = config.role
  const audioStream = await getMediaStream()
  try {
    await infinityClient.call({
      conferenceAlias: getMainConferenceAlias() + language.code,
      callType: role === Role.Interpreter ? ClientCallType.AudioSendOnly : ClientCallType.AudioRecvOnly,
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

const leave = async (): Promise<void> => {
  await infinityClient.disconnect({ reason: 'User initiated disconnect' })
  currentLanguage = null
  handleChangeCallback(null)
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

const getMediaStream = async (): Promise<MediaStream> => {
  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    })
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
  getCurrentLanguage,
  leave
}
