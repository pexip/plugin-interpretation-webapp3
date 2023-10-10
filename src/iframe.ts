import iframeResizer from 'iframe-resizer'

export const initializeIFrame = (): void => {
  const pluginIFrame = getIFrame()
  if (pluginIFrame != null) {
    const style = pluginIFrame.style
    style.position = 'absolute'
    style.display = 'block'
    style.margin = 'auto'
    style.border = '0'
    style.top = '16px'
    style.right = '0'
    style.left = '0'
  }
  // Take out overflow from body
  const body = document.getElementsByTagName('body')[0]
  body.style.overflow = 'hidden'

  iframeResizer.iframeResizer({ sizeWidth: true }, pluginIFrame as HTMLElement)
}

export const toggleIFramePointerEvents = (enable: boolean): void => {
  const pluginIFrame = getIFrame()
  if (pluginIFrame != null) {
    const style = pluginIFrame.style
    if (enable) {
      style.pointerEvents = 'inherit'
      parent.document.body.style.cursor = 'inherit'
    } else {
      style.pointerEvents = 'none'
      parent.document.body.style.cursor = 'grabbing'
    }
  }
}

export const moveIFrame = (x: number, y: number): void => {
  const pluginIFrame = getIFrame()

  const xMargin = 23
  const yMargin = 20

  let newX = x - xMargin
  let newY = y - yMargin

  if (pluginIFrame != null) {
    newX = Math.max(0, newX)
    newY = Math.max(0, newY)
    newX = Math.min(newX, parent.window.innerWidth - parseInt(pluginIFrame.style.width))
    newY = Math.min(newY, parent.window.innerHeight - parseInt(pluginIFrame.style.height))
    const style = pluginIFrame.style
    style.position = 'absolute'
    style.left = `${newX}px`
    style.top = `${newY}px`
    style.right = 'inherit'
  }
}

const getIFrame = (): HTMLIFrameElement | undefined => {
  const url = document.location.href
  const iframes = [...window.parent.document.getElementsByTagName('iframe')]
  // Ignore the protocol when comparing
  const pluginIFrame = iframes.find((iframe) => iframe.src.split('//')[1] === url.split('//')[1])
  return pluginIFrame
}
