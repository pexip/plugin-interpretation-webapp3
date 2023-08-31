import React, { useState } from 'react'

import { Box, Button, Icon, IconTypes, Text, Tooltip } from '@pexip/components'
import { capitalizeFirstLetter } from '../../utils'
import { Role } from '../../role'
import { Interpretation } from '../../interpretation'
import { showDisconnectPrompt } from '../../prompts'

import './LanguagePanel.scss'
import { showSelectMicForm } from '../../forms'

interface LanguageIndicatorProps {
  languageName: string
  role: Role
}

export const LanguageIndicator = (props: LanguageIndicatorProps): JSX.Element => {
  const [audioMuted, setAudioMuted] = useState(false)

  const handleMuteAudio = async (): Promise<void> => {
    await Interpretation.setAudioMuted(!audioMuted)
    setAudioMuted(!audioMuted)
  }

  return (
    <Box className='LanguageIndicator'>
      <Icon source={IconTypes.IconSupport} className='LanguageIcon' color=''/>
      <Text className='LanguageText'>
        {capitalizeFirstLetter(props.languageName)}
      </Text>
      {props.role === Role.Interpreter &&
      <div className='Toolbar'>
        <Tooltip text={audioMuted ? 'Unmute microphone' : 'Mute microphone'} position='bottom'>
          <Button modifier='square' onClick={() => { handleMuteAudio().catch((e) => { console.error(e) }) }} variant={audioMuted ? 'danger' : 'primary'}>
            <Icon source={audioMuted ? IconTypes.IconMicrophoneOff : IconTypes.IconMicrophoneOn} />
          </Button>
        </Tooltip>
        <Tooltip text='Change microphone' position='bottom'>
          <Button modifier='square' onClick={() => { showSelectMicForm().catch((e) => { console.error(e) }) }} >
            <Icon source={IconTypes.IconSettings} />
          </Button>
        </Tooltip>
        <Tooltip text='Leave interpretation' position='bottom'>
          <Button modifier='square' onClick={() => { showDisconnectPrompt().catch((e) => { console.error(e) }) }} aria-label='Test'>
            <Icon source={IconTypes.IconLeave} />
          </Button>
        </Tooltip>
      </div>
      }
    </Box>
  )
}
