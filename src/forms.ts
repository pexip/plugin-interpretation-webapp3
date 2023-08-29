import { config } from './config'
import { Interpretation } from './interpretation'
import { getLanguageByCode } from './language'
import { getPlugin } from './plugin'
import { capitalizeFirstLetter } from './utils'

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

const getLanguageOptions = (): any => {
  const options = config.languages.map((language) => ({
    id: language.code,
    label: capitalizeFirstLetter(language.name)
  }))
  return options
}
