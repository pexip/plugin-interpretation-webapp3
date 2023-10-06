import React, { useEffect, useRef, useState } from 'react'

import { Box, BoxHeader, Button, Icon, IconTypes, RangeSlider, Text, Tooltip } from '@pexip/components'
import { capitalizeFirstLetter } from '../../utils'
import { Role } from '../../role'
import { Interpretation } from '../../interpretation'
import { showDisconnectPrompt } from '../../prompts'

import './LanguagePanel.scss'
import { showSelectMicForm } from '../../forms'
import { moveIFrame, toggleIFramePointerEvents, togglePointerEvents } from '../../iframe'

interface LanguageIndicatorProps {
  languageName: string
  role: Role
}

export const LanguageIndicator = (props: LanguageIndicatorProps): JSX.Element => {
  const [audioMuted, setAudioMuted] = useState(false)
  const [volume, setVolume] = useState<number>(0)

  const refDragButton = useRef<HTMLButtonElement>(null)

  const handleMuteAudio = async (): Promise<void> => {
    await Interpretation.setAudioMuted(!audioMuted)
    setAudioMuted(!audioMuted)
  }

  useEffect(() => {
    let dragging = false

    const handleMove = (event: MouseEvent): void => {
      if (dragging) {
        const x = event.pageX
        const y = event.pageY
        moveIFrame(x, y)
      }
    }

    if (refDragButton?.current != null) {
      refDragButton.current.addEventListener('mousedown', (e) => {
        dragging = true
        toggleIFramePointerEvents(false)
        e.preventDefault()
        parent.document.body.addEventListener('mouseup', () => {
          dragging = false
          toggleIFramePointerEvents(true)
        }, { once: true })
      })
      parent.document.addEventListener('mousemove', handleMove)
    }
    return () => {
      parent.document.removeEventListener('mousemove', handleMove)
    }
  }, [refDragButton])

  return (
    <Box className='LanguagePanel'>
      <BoxHeader className='Header'>
        <button className="DraggableButton" ref={refDragButton}><Icon source={IconTypes.IconDraggable} /></button>
        <span className='Title'>Interpretation</span>
        <Icon source={IconTypes.IconMinus} />
        <Icon source={IconTypes.IconClose} />
      </BoxHeader>
      <div className='Container'>
        <div className='row'>
          <Text className='LanguageText'>
            {capitalizeFirstLetter(props.languageName)}
          </Text>
          <div className='Toolbar'>
              {props.role === Role.Interpreter &&
                <>
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
                </>
              }
              <Tooltip text='Leave interpretation' position='bottom'>
                <Button modifier='square' onClick={() => { showDisconnectPrompt().catch((e) => { console.error(e) }) }} aria-label='Test'>
                  <Icon source={IconTypes.IconLeave} />
                </Button>
              </Tooltip>
          </div>
        </div>
        <span>Volume</span>
        <RangeSlider className='VolumeSlider' min={0} max={100} step={1} selectedValue={volume} onChange={(event) => { setVolume(parseInt(event.target.value)) }}/>
        <span>Main floor</span><span>Interpreter</span>
      </div>
    </Box>
  )
}
