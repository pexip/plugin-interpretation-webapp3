import { showInterpreterForm } from './forms'
import { Interpretation } from './interpretation'
import { getPlugin } from './plugin'
import { showDisconnectPrompt } from './prompts'
import { isSameDomain } from './utils'

export const initializeButton = async (): Promise<void> => {
  const plugin = getPlugin()
  const button = await plugin.ui.addButton({
    position: 'toolbar',
    roles: ['chair', 'guest'],
    icon: 'IconSupport',
    tooltip: 'Open Interpretation'
  })
  button.onClick.add(handleOnClick)
}

const handleOnClick = async (): Promise<void> => {
  if (isSameDomain()) {
    if (Interpretation.getCurrentLanguage() != null) {
      await showDisconnectPrompt()
    } else {
      await showInterpreterForm()
    }
  } else {
    await getPlugin().ui.showToast({ message: 'Interpretation plugin should be served from the Web App 3 domain.' })
  }
}
