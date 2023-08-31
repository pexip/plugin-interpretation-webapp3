import { config } from './config'
import { Interpretation } from './interpretation'
import { getLanguageByCode } from './language'
import { getPlugin } from './plugin'
import { capitalizeFirstLetter } from './utils'

type Options = Array<{
  id: string
  label: string
}>

export const showInterpreterForm = async (): Promise<void> => {
  const plugin = getPlugin()

  const input = await plugin.ui.showForm({
    title: 'Select language',
    form: {
      elements: {
        language: {
          name: 'Language',
          type: 'select',
          options: getLanguageOptions()
        }
      },
      submitBtnTitle: 'Join'
    }
  })
  const language = getLanguageByCode(input.language)
  if (language != null) {
    await Interpretation.join(language)
  }
}

export const showPinForm = async (): Promise<void> => {
  const plugin = getPlugin()

  const input = await plugin.ui.showForm({
    title: 'PIN Required',
    form: {
      elements: {
        pin: {
          name: 'PIN',
          type: 'password',
          placeholder: 'Enter PIN',
          isOptional: false
        }
      },
      submitBtnTitle: 'Join'
    }
  })
  if (input.pin != null) {
    const language = Interpretation.getCurrentLanguage()
    if (language != null) {
      await Interpretation.join(language, input.pin)
    }
  } else {
    await Interpretation.leave()
  }
}

export const showSelectMicForm = async (): Promise<void> => {
  const plugin = getPlugin()

  const devices = await navigator.mediaDevices.enumerateDevices()
  const audioInputDevices = devices.filter((device) => device.kind === 'audioinput')

  const input = await plugin.ui.showForm({
    title: 'Select Microphone',
    description: 'Select the microphone to use for the interpretation. It could be different that the one used in the main room.',
    form: {
      elements: {
        device: {
          name: 'Microphone',
          type: 'select',
          options: getAudioInputDevicesOptions(audioInputDevices)
        }
      },
      submitBtnTitle: 'Change'
    }
  })
  if (input.device != null) {
    await Interpretation.setAudioInputDevice(input.device)
  }
}

const getLanguageOptions = (): Options => {
  const options = config.languages.map((language) => ({
    id: language.code,
    label: capitalizeFirstLetter(language.name)
  }))
  return options
}

const getAudioInputDevicesOptions = (devices: MediaDeviceInfo[]): Options => {
  const options = devices.map((device) => ({
    id: device.deviceId,
    label: device.label
  }))
  return options
}
