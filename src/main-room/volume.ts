const videoMeetingTestId = 'video-meeting'

const videoMeetingSelector = `video[data-testid=${videoMeetingTestId}]`

const set = (volume: number): void => {
  const video: HTMLVideoElement | null = parent.document.querySelector(videoMeetingSelector)
  if (video != null) {
    video.volume = volume
  }
}

const MainRoomVolume = { set }

export { MainRoomVolume }
