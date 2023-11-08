import React, { useEffect, useState } from 'react'

import { DeviceSelect } from '@pexip/media-components'
import { Icon, IconTypes, Tooltip } from '@pexip/components'
import type { MediaDeviceInfoLike } from '@pexip/media-control'
import { Interpretation } from '../../interpretation'

import './Settings.scss'

export const Settings = (): JSX.Element => {
  const [opened, setOpened] = useState(false)

  const [devices, setDevices] = useState<MediaDeviceInfoLike[]>()
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfoLike>()

  const [audioMuted, setAudioMuted] = useState(false)

  const handleMuteAudio = async (): Promise<void> => {
    await Interpretation.setAudioMuted(!audioMuted)
    setAudioMuted(!audioMuted)
  }

  const handleChangeMicrophone = async (device: MediaDeviceInfoLike): Promise<void> => {
    await Interpretation.setAudioInputDevice(device.deviceId)
    setSelectedDevice(device)
  }

  useEffect(() => {
    const bootstrap = async (): Promise<void> => {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const filteredDevice = devices.filter((device) => device.kind === 'audioinput')
      setDevices(filteredDevice)
      const deviceId = Interpretation.getAudioInputDevice()
      const selectedDevice = filteredDevice.find((device) => device.deviceId === deviceId)
      setSelectedDevice(selectedDevice ?? devices[0])
    }
    bootstrap().catch((e) => { console.error(e) })
  }, [])

  return (
    <div className='Settings'>
      <button className='SettingsHeader'onClick={() => { setOpened(!opened) }}>
        <Icon className={`Chevron ${opened ? 'opened' : ''}`} source={IconTypes.IconChevronRight}/>
        <span>View settings</span>
      </button>

      {opened && <div className='SettingsContainer'>

        <Tooltip text={audioMuted ? 'Unmute microphone' : 'Mute microphone'} position='right'>
            <Icon
              source={audioMuted ? IconTypes.IconMicrophoneOff : IconTypes.IconMicrophoneOn}
              onClick={() => { handleMuteAudio().catch((e) => { console.error(e) }) }}
              className='MuteAudioButton'
            />
        </Tooltip>

        <DeviceSelect
          className='ChangeMicrophone'
          devices={devices ?? []}
          isDisabled={false}
          label={selectedDevice?.label ?? 'Select microphone'}
          onDeviceChange={(device) => { handleChangeMicrophone(device).catch((e) => { console.error(e) }) }}
        />
      </div>}
    </div>
  )
}
