import { getPlugin } from './plugin'
import { isSameDomain } from './utils'
import { showInterpreterForm } from './forms'
import type { Button, ToolbarButtonPayload } from '@pexip/plugin-api'
import type { InterpretationContextType } from './InterpretationContext/InterpretationContext'

let button: Button<'toolbar'>

const tooltipActive = 'Join interpretation'
const tooltipInactive = 'Leave interpretation'

const buttonPayload: ToolbarButtonPayload = {
  position: 'toolbar',
  icon: 'IconSupport',
  tooltip: tooltipActive,
  roles: ['chair', 'guest']
}

let interpretationContext: InterpretationContextType

export const refreshContextButton = (context: InterpretationContextType): void => {
  interpretationContext = context
}

export const initializeButton = async (): Promise<void> => {
  const plugin = getPlugin()
  button = await plugin.ui.addButton(buttonPayload)
  button.onClick.add(handleClick)
}

export const setButtonActive = async (active: boolean): Promise<void> => {
  await button.update(Object.assign(buttonPayload, {
    isActive: active,
    tooltip: active ? tooltipActive : tooltipInactive
  }))
}

const handleClick = async (): Promise<void> => {
  const { minimize, state } = interpretationContext
  const { connected } = state

  if (connected) {
    minimize(false)
  } else {
    await showInterpreterForm()
  }
}
