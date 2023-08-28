import type { Plugin } from '@pexip/plugin-api'

import { getPlugin } from './plugin'
import {
  ClientCallType,
  type InfinityClient,
  type InfinitySignals,
  createCallSignals,
  createInfinityClient,
  createInfinityClientSignals
} from '@pexip/infinity'
import { getUser } from './user'
import { showPinForm } from './forms'

let plugin: Plugin

let conferenceAlias: string
let languageCode: string

let infinityClient: InfinityClient

export const setMainConferenceAlias = (alias: string): void => {
  conferenceAlias = alias
}

export const joinInterpreter = async (code: string): Promise<void> => {
  plugin = getPlugin()
  languageCode = code
  try {
    const infinityClientSignals = createInfinityClientSignals([])
    const callSignals = createCallSignals([])
    initializeInfinityClientSignals(infinityClientSignals)
    infinityClient = createInfinityClient(infinityClientSignals, callSignals)
    await makeCall()
  } catch (e) {
    console.error(e)
  }
}

export const makeCallWithPin = async (pin: string): Promise<void> => {
  await makeCall(pin)
}

const getMediaStream = async (): Promise<MediaStream> => {
  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    })
  } catch (e) {
    await plugin.ui.showToast({ message: 'Interpretation cannot access the microphone' })
    throw e
  }
  return stream
}

const initializeInfinityClientSignals = (signals: InfinitySignals): void => {
  signals.onPinRequired.add(async ({ hasHostPin, hasGuestPin }) => {
    if (hasHostPin) {
      await showPinForm()
    }
  })
}

export const makeCall = async (pin?: string): Promise<void> => {
  const audioStream = await getMediaStream()
  try {
    await infinityClient.call({
      conferenceAlias: conferenceAlias + languageCode,
      callType: ClientCallType.AudioSendOnly,
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

window.addEventListener('beforeunload', () => {
  infinityClient?.disconnect({ reason: 'Browser closed' }).catch((e) => { console.error(e) })
})
