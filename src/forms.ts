import { config } from './config'
import { type ConnectRequest, Interpretation } from './interpretation/interpretation'
import { getLanguageByCode, getLanguageOptions } from './language'
import { getPlugin } from './plugin'
import type { Language } from './types/Language'

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
  const request: ConnectRequest = {
    language: getLanguageByCode(input.language) as Language,
    role: config.role
  }
  await Interpretation.connect(request)
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
    const request: ConnectRequest = {
      language: Interpretation.getCurrentLanguage() as Language,
      role: config.role,
      pin: input.pin
    }
    await Interpretation.connect(request)
  } else {
    await Interpretation.leave()
  }
}
