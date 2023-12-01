// import EventEmitter from 'eventemitter3'

let mediaConstraints: MediaStreamConstraints | null = null

const getConstraints = (): MediaStreamConstraints | null => {
  return mediaConstraints
}

// const emitter = new EventEmitter()

const overrideGetUserMedia = (): void => {
  const callback = parent.navigator.mediaDevices.getUserMedia
  parent.navigator.mediaDevices.getUserMedia = async (constraints?: MediaStreamConstraints): Promise<MediaStream> => {
    // Ignore the changes while the settings panel is open.
    setTimeout(() => { processConstraints(constraints) }, 100)
    parent.navigator.mediaDevices.getUserMedia = callback
    const mediaStream = await parent.navigator.mediaDevices.getUserMedia(constraints)
    overrideGetUserMedia()
    return mediaStream
  }
}

const processConstraints = (constraints?: MediaStreamConstraints): void => {
  const settingsModal = parent.document.querySelector('div[data-testid=modal-settings]')
  if (settingsModal == null) {
    mediaConstraints = constraints ?? null
    // emitter.emit('changed', constraints)
  }
}

overrideGetUserMedia()

export const MainRoomMediaConstraints = {
  get: getConstraints
  // emitter
}
