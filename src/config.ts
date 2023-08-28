interface Language {
  code: string
  name: string
}

interface Config {
  languages: Language[]
}

const response = await fetch('./config.json')
const config: Config = await response.json()

export {
  config
}
