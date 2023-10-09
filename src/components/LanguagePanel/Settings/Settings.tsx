import React from 'react'

import { DeviceSelect } from '@pexip/media-components'
import { IconTypes } from '@pexip/components'
import type { MediaDeviceInfoLike } from '@pexip/media-control'

import './Settings.scss'

export const Settings = (): JSX.Element => {
  return (
  <div className='Settings'>
      <button>View all settings</button>
      <DeviceSelect
        className='ChangeMicrophone'
        devices={[]}
        isDisabled={false}
        label='Microphone'
        iconType={IconTypes.IconMicrophoneOn}
        onDeviceChange={
          function (device: MediaDeviceInfoLike): void {
            throw new Error('Function not implemented.')
          }
        }
      />
    </div>
  )
}

// const [audioMuted, setAudioMuted] = useState(false)
// const handleMuteAudio = async (): Promise<void> => {
//   await Interpretation.setAudioMuted(!audioMuted)
//   setAudioMuted(!audioMuted)
// }
// {/* <div className='Toolbar'>
//     {props.role === Role.Interpreter &&
//       <>
//         <Tooltip text={audioMuted ? 'Unmute microphone' : 'Mute microphone'} position='bottom'>
//           <Button modifier='square' onClick={() => { handleMuteAudio().catch((e) => { console.error(e) }) }} variant={audioMuted ? 'danger' : 'primary'}>
//             <Icon source={audioMuted ? IconTypes.IconMicrophoneOff : IconTypes.IconMicrophoneOn} />
//           </Button>
//         </Tooltip>
//         <Tooltip text='Change microphone' position='bottom'>
//           <Button modifier='square' onClick={() => { showSelectMicForm().catch((e) => { console.error(e) }) }} >
//             <Icon source={IconTypes.IconSettings} />
//           </Button>
//         </Tooltip>
//       </>
//     }
// </div> */}
