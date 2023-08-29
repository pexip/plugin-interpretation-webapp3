import { Interpretation } from './interpretation'
import { getPlugin } from './plugin'
import { capitalizeFirstLetter } from './utils'

export const showDisconnectPrompt = async (): Promise<void> => {
  const plugin = getPlugin()
  const languageName = capitalizeFirstLetter(Interpretation.getCurrentLanguage()?.name ?? '')
  const primaryAction = 'Leave'

  const prompt = await plugin.ui.addPrompt({
    title: 'Leave Interpretation',
    description: `Do you want to leave the "${languageName}" channel?`,
    prompt: {
      primaryAction,
      secondaryAction: 'Cancel'
    }
  })

  prompt.onInput.add(async (result) => {
    await prompt.remove()
    if (result === primaryAction) {
      Interpretation.leave()
    }
  })
}
