import { getLanguageByCode, getLanguageOptions } from './language'
import { getPlugin } from './plugin'
import type { InterpretationContextType } from './InterpretationContext/InterpretationContext'

let interpretationContext: InterpretationContextType

export const refreshContextForms = (context: InterpretationContextType): void => {
  interpretationContext = context
}

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
    await interpretationContext.connect(language)
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
    const { state } = interpretationContext
    const { language } = state

    if (language != null) {
      interpretationContext.setPin(input.pin)
      await interpretationContext.connect(language)
    }
  } else {
    await interpretationContext.disconnect()
  }
}
