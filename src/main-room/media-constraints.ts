const audioInputKey = 'infinity-connect:audioInput'

let mediaConstraints: MediaStreamConstraints | null = null

const getConstraints = (): MediaStreamConstraints | null => {
  return mediaConstraints
}

window.addEventListener('storage', (event: StorageEvent) => {
  if (event.key === audioInputKey) {
    if (event.newValue != null) {
      mediaConstraints = JSON.parse(event.newValue)
    }
  }
})

// const emitter = new EventEmitter()

// const overrideGetUserMedia = (): void => {
//   // eslint-disable-next-line @typescript-eslint/unbound-method
//   const callback = parent.navigator.mediaDevices.getUserMedia
//   parent.navigator.mediaDevices.getUserMedia = async (constraints?: MediaStreamConstraints): Promise<MediaStream> => {
//     // Ignore the changes while the settings panel is open.
//     setTimeout(() => { processConstraints(constraints) }, 500)
//     parent.navigator.mediaDevices.getUserMedia = callback
//     const mediaStream = await parent.navigator.mediaDevices.getUserMedia(constraints)
//     overrideGetUserMedia()
//     return mediaStream
//   }
// }

// const processConstraints = (constraints?: MediaStreamConstraints): void => {
//   const settingsModal = parent.document.querySelector('div[data-testid=modal-settings]')
//   console.log(settingsModal)
//   if (settingsModal == null) {
//     console.log('Changing constraints')
//     mediaConstraints = constraints ?? null
//     // emitter.emit('changed', constraints)
//   }
// }

// overrideGetUserMedia()

export const MainRoomMediaConstraints = {
  get: getConstraints
  // emitter
}
