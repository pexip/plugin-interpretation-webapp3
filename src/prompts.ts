import { getPlugin } from './plugin'
import type { InterpretationContextType } from './InterpretationContext/InterpretationContext'

let interpretationContext: InterpretationContextType

export const refreshContextPrompts = (context: InterpretationContextType): void => {
  interpretationContext = context
}

export const showDisconnectPrompt = async (): Promise<void> => {
  const plugin = getPlugin()
  const primaryAction = 'Leave'

  const prompt = await plugin.ui.addPrompt({
    title: 'Leave Interpretation',
    description: 'Do you want to leave the interpretation?',
    prompt: {
      primaryAction,
      secondaryAction: 'Cancel'
    }
  })

  prompt.onInput.add(async (result) => {
    await prompt.remove()
    if (result === primaryAction) {
      await interpretationContext.disconnect()
    }
  })
}

export const showErrorPrompt = async (message: string): Promise<void> => {
  const plugin = getPlugin()

  await plugin.ui.showPrompt({
    title: 'Error',
    description: message,
    prompt: {
      primaryAction: 'Close'
    }
  })
}
