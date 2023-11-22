const set = (volume: number): void => {
  const video = parent.document.querySelector("[data-testid='video-meeting']") as HTMLVideoElement
  if (video != null) {
    video.volume = volume
  }
}

const MainRoomVolume = { set }

export { MainRoomVolume }
