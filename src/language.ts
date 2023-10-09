import { config } from './config'
import { capitalizeFirstLetter } from './utils'

import type { Option } from './types/Option'

export interface Language {
  code: string
  name: string
}

export const getLanguageByCode = (code: string): Language | undefined => {
  return config.languages.find((language) => language.code === code)
}

export const getLanguageOptions = (): Option[] => {
  const options = config.languages.map((language) => ({
    id: language.code,
    label: capitalizeFirstLetter(language.name)
  }))
  return options
}
