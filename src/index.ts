import { registerPlugin } from '@pexip/plugin-api'
import { setPlugin } from './plugin'
import { initializeEvents } from './events'
import { initializeButton } from './button'
import { initializeIFrame } from './iframe'

const plugin = await registerPlugin({
  id: 'interpretation',
  version: 0
})

setPlugin(plugin)

initializeEvents()
await initializeButton()
initializeIFrame()
