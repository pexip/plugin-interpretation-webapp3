export const initializeIFrame = (): void => {
  const url = document.location.href
  const iframes = [...window.parent.document.getElementsByTagName('iframe')]
  // Ignore the protocol when comparing
  const pluginIFrame = iframes.find((iframe) => iframe.src.split('//')[1] === url.split('//')[1])
  if (pluginIFrame != null) {
    const style = pluginIFrame.style
    style.position = 'relative'
    style.display = 'block'
    style.margin = 'auto'
    style.width = '400px'
    style.height = '150px'
    style.border = '0'
  }
  // Take out overflow from body
  const body = document.getElementsByTagName('body')[0]
  body.style.overflow = 'hidden'
}
