import React, { useState } from 'react'

import { RangeSlider } from '@pexip/components'
import { Interpretation } from '../../interpretation/interpretation'

import './Volume.scss'
import { MainRoomVolume } from '../../main-room/volume'

export const Volume = (): JSX.Element => {
  const [volume, setVolume] = useState<number>(0)

  const handleVolumeChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const volume = parseInt(event.target.value)
    setVolume(volume)
    const volumeMainRoom = (100 - Math.max((volume - 50) * 2, 0)) / 100
    const volumeInterpretation = Math.min(volume * 2, 100) / 100
    MainRoomVolume.set(volumeMainRoom)
    Interpretation.setInterpretationVolume(volumeInterpretation)
    console.log(`Volume Main Room: ${volumeMainRoom}`)
    console.log(`Volume Interpreter: ${volumeInterpretation}`)
  }

  return (
    <div className='Volume' data-testid='Volume'>
      <span>Volume</span>
      <RangeSlider className='VolumeSlider' min={0} max={100} step={1} selectedValue={volume}
        onChange={(event) => { handleVolumeChange(event).catch((e) => { console.error(e) }) }}
      />
      <div className={`VolumeFooter ${volume < 50 ? 'MainFloorSelected' : 'InterpreterSelected'}`}>
        <span className='MainFloorLabel'>Main floor</span>
        <span className='InterpreterLabel'>Interpreter</span>
      </div>
    </div>
  )
}
