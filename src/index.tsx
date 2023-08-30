import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

import '@pexip/components/src/fonts.css'
import '@pexip/components/dist/style.css'

const root = document.getElementById('root')
if (root == null) {
  throw new Error('Not found element with id=root')
}
ReactDOM.createRoot(root).render(<App />)
