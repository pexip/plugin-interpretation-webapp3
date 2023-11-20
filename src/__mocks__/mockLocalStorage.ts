export const mockLocalStorage = (): any => {
  const storage: any = {}

  return {
    setItem: (key: string, value: string) => {
      storage[key] = value
    },
    getItem: (key: string) => {
      return key in storage ? storage[key] : null
    },
    removeItem: (key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete storage[key]
    },
    get length () {
      return Object.keys(storage).length
    },
    key: (i: number) => {
      const keys = Object.keys(storage)
      return keys[i] ?? null
    }
  }
}
