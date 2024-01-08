import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Append meta
const oldMetaElement = document.querySelector('meta')
const metaElement = document.createElement('meta')
metaElement.content = 'width=device-width,initial-scale=1, maximum-scale=1'
metaElement.name = 'viewport'
document.head.removeChild(oldMetaElement)
document.head.appendChild(metaElement)

// Append div id app
const rootElement = document.createElement('div')
rootElement.id = 'app'
document.body.appendChild(rootElement)

// Render your React component instead
const root = createRoot(document.getElementById('app'))
root.render(<App />)
