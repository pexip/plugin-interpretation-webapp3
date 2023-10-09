import type { Language } from './language'
import type { Role } from './types/Role'

interface Config {
  role: Role
  languages: Language[]
}

const response = await fetch('./config.json')
const config: Config = await response.json()

export {
  config
}
