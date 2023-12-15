import { getInterpretationContext } from '../interpretationContext'

const audioInputKey = 'infinity-connect:audioInput'

let mediaConstraints: MediaTrackConstraints

const getConstraints = (): MediaTrackConstraints => {
  return mediaConstraints
}

window.addEventListener('storage', (event: StorageEvent) => {
  if (event.key === audioInputKey) {
    if (event.newValue != null) {
      const constraints: MediaTrackConstraints = JSON.parse(event.newValue)
      mediaConstraints = constraints
      getInterpretationContext().changeMediaDevice(constraints).catch((e) => { console.error(e) })
    }
  }
})

export const MainRoomMediaConstraints = {
  get: getConstraints
}
