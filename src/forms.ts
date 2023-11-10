import { Interpretation } from './interpretation/interpretation'
import { type Language, getLanguageByCode, getLanguageOptions } from './language'
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
  const language = getLanguageByCode(input.language) as Language
  await Interpretation.connect(language)
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
      await Interpretation.connect(language, input.pin)
    }
  } else {
    await Interpretation.leave()
  }
}
