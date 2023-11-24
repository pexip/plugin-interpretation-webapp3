import React, { useState } from 'react'
import { Button, Icon, IconTypes } from '@pexip/components'
import clsx from 'clsx'

import './MuteButton.scss'

interface MuteButtonProps {
  label?: string
}

export const MuteButton = (props: MuteButtonProps): JSX.Element => {
  const [muted, setMuted] = useState(false)

  return (
    <Button className={clsx('MuteButton', { muted })} data-testid='MuteButton' variant='bordered'
      onClick={() => { setMuted(!muted) }}>
      <Icon source={muted ? IconTypes.IconMicrophoneOff : IconTypes.IconMicrophoneOn} />
      <span>{muted ? 'Unmute' : 'Mute'} {props.label}</span>
    </Button>
  )
}
