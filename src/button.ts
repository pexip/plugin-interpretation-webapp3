import { showInterpreterForm } from './forms'
import { Interpretation } from './interpretation/interpretation'
import { getPlugin } from './plugin'
import { isSameDomain } from './utils'

import type { Button, ToolbarButtonPayload } from '@pexip/plugin-api'

let button: Button<'toolbar'>

const tooltipActive = 'Join interpretation'
const tooltipInactive = 'Leave interpretation'

const buttonPayload: ToolbarButtonPayload = {
  position: 'toolbar',
  icon: 'IconSupport',
  tooltip: tooltipActive,
  roles: ['chair', 'guest']
}

export const initializeButton = async (): Promise<void> => {
  const plugin = getPlugin()
  button = await plugin.ui.addButton(buttonPayload)
  button.onClick.add(handleOnClick)
}

export const setButtonActive = async (active: boolean): Promise<void> => {
  await button.update(Object.assign(buttonPayload, {
    isActive: active,
    tooltip: active ? tooltipActive : tooltipInactive
  }))
}

const handleOnClick = async (): Promise<void> => {
  if (isSameDomain()) {
    if (Interpretation.getLanguage() != null) {
      Interpretation.minimize(false)
    } else {
      await showInterpreterForm()
    }
  } else {
    await getPlugin().ui.showToast({ message: 'Interpretation plugin should be served from the Web App 3 domain.' })
  }
}
