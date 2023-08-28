import type { Plugin } from '@pexip/plugin-api'

let pluginInstance: Plugin

export const setPlugin = (plugin: Plugin): void => {
  pluginInstance = plugin
}

export const getPlugin = (): Plugin => {
  return pluginInstance
}
