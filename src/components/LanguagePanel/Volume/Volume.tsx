import React, { useState } from 'react'

import { RangeSlider } from '@pexip/components'

import './Volume.scss'

export const Volume = (): JSX.Element => {
  const [volume, setVolume] = useState<number>(0)

  return (
    <div className='Volume'>
      <span>Volume</span>
      <RangeSlider className='VolumeSlider' min={0} max={100} step={1} selectedValue={volume} onChange={(event) => { setVolume(parseInt(event.target.value)) }}/>
      <div className='VolumeFooter'>
        <span>Main floor</span>
        <span>Interpreter</span>
      </div>
    </div>
  )
}
