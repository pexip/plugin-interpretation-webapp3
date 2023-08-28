export const initializeIFrame = (): void => {
  const url = document.location.href
  const iframes = [...window.parent.document.getElementsByTagName('iframe')]
  // Ignore the protocol when comparing
  const pluginIFrame = iframes.find((iframe) => iframe.src.split('//')[1] === url.split('//')[1])
  if (pluginIFrame != null) {
    // @ts-expect-error Ignore the only-read style property
    pluginIFrame.style = 'position: relative; margin: auto; width: 200px; border: 0; pointer-events: none;'
  }
  const root = document.createElement('div')
  root.id = 'root'
  document.getElementsByTagName('body')[0].appendChild(root)
}
