import React from 'react'
import { Button, Icon, IconTypes } from '@pexip/components'

import './MuteButton.scss'

export const MuteButton = (): JSX.Element => {
  return (
    <Button className='MuteButton' data-testid='MuteButton' variant='bordered'>
      <Icon source={IconTypes.IconMicrophoneOn} />
      <span>Mute in Main floor</span>
    </Button>
  )
}
