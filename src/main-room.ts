export const muteMainRoomAudio = (): void => {
  const button: HTMLButtonElement | null = window.parent.document.querySelector('[data-testid="button-meeting-audioinput"]')
  if (button != null) {
    button.click()
  }
}

export const setMainRoomVolume = (volume: number): void => {
  const video: HTMLVideoElement | null = window.parent.document.querySelector('[data-testid="video-meeting"]')
  if (video != null) {
    video.volume = volume
  }
}
