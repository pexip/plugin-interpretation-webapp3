import { joinInterpreter, makeCallWithPin } from './conference'
import { config } from './config'
import { getPlugin } from './plugin'

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
  await joinInterpreter(input.language)
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
  await makeCallWithPin(input.pin)
}

const getLanguageOptions = (): any => {
  const options = config.languages.map((language) => ({
    id: language.code,
    label: capitalizeFirstLetter(language.name)
  }))
  return options
}

const capitalizeFirstLetter = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
