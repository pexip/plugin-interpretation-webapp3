import {
  ClientCallType,
  type InfinitySignals,
  createCallSignals,
  createInfinityClient,
  createInfinityClientSignals,
  type CallSignals
} from '@pexip/infinity'
import type { Language } from '../types/Language'
import { showPinForm } from '../forms'
import { getPlugin } from '../plugin'
import { config } from '../config'
import { getMainConferenceAlias } from '../conference'
import { getUser } from '../user'
import { Role } from '../types/Role'
import { showErrorPrompt } from '../prompts'
import { Direction } from '../types/Direction'

const deviceIdStorageKey = 'PexInterpretation:deviceId'

const clientSignals = createInfinityClientSignals([])
const callSignals = createCallSignals([])
const infinityClient = createInfinityClient(clientSignals, callSignals)
const audio: HTMLAudioElement = new Audio()

let handleChangeCallback: (language: Language | null, direction: Direction) => void
let currentLanguage: Language | null = null
let currentRole: Role | null = null
let currentDirection: Direction = Direction.MainRoomToInterpretation
let signalsInitialized: boolean = false
let mediaStream: MediaStream | undefined
let mainRoomVolume: number = 1

const registerOnChangeLanguageCallback = (callback: (language: Language | null, direction: Direction) => void): void => {
  handleChangeCallback = callback
}

interface ConnectRequest {
  language: Language
  role: Role
  pin?: string
  direction?: Direction
}

const connect = async (request: ConnectRequest): Promise<void> => {
  currentLanguage = request.language
  currentRole = request.role
  currentDirection = request.direction ?? Direction.MainRoomToInterpretation

  if (!signalsInitialized) {
    initializeInfinityClientSignals(clientSignals)
    initializeInfinityCallSignals(callSignals)
    signalsInitialized = true
  }

  const username = getUser().displayName ?? getUser().uuid
  let roleTag: string
  let callType: ClientCallType

  if (request.role === Role.Interpreter) {
    roleTag = 'Interpreter'
    mediaStream = await getMediaStream()
    callType = ClientCallType.AudioSendOnly
  } else {
    roleTag = 'Listener'
    mediaStream = undefined
    callType = ClientCallType.AudioRecvOnly
  }

  const displayName = `${username} - ${roleTag}`

  // TODO: Leave if we are connected to another channel

  try {
    await infinityClient.call({
      conferenceAlias: getMainConferenceAlias() + request.language.code,
      displayName,
      callType,
      bandwidth: 0,
      mediaStream,
      pin: request.pin
    })
  } catch (e) {
    stopStream(mediaStream)
    throw e
  }
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

const getCurrentLanguage = (): Language | null => currentLanguage

const setMainRoomVolume = (volume: number): void => {
  mainRoomVolume = volume
  const remoteVideo = parent.document.querySelector("[data-testid='video-meeting']") as HTMLVideoElement
  if (remoteVideo != null) {
    remoteVideo.volume = mainRoomVolume
  }
}

const getMainRoomVolume = (): number => mainRoomVolume

const setInterpretationVolume = (volume: number): void => {
  audio.volume = volume
}

const leave = async (): Promise<void> => {
  await infinityClient.disconnect({ reason: 'User initiated disconnect' })
  currentLanguage = null
  handleChangeCallback(null, Direction.MainRoomToInterpretation)
  audio.pause()
  setMainRoomVolume(1)
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
        if (currentLanguage != null && currentRole != null) {
          const pin = ' '
          const request: ConnectRequest = {
            language: currentLanguage,
            role: currentRole,
            pin
          }
          await connect(request)
        }
      }
    }
    // TODO: What to do when no PIN for guest
  })
  signals.onAuthenticatedWithConference.add(async () => {
    handleChangeCallback(currentLanguage, currentDirection)
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
  connect,
  setAudioMuted,
  setAudioInputDevice,
  getAudioInputDevice,
  getCurrentLanguage,
  setMainRoomVolume,
  getMainRoomVolume,
  setInterpretationVolume,
  leave
}

export type {
  ConnectRequest
}
