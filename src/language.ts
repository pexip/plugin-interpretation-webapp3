import { config } from './config'

export interface Language {
  code: string
  name: string
}

export const getLanguageByCode = (code: string): Language | undefined => {
  return config.languages.find((language) => language.code === code)
}
