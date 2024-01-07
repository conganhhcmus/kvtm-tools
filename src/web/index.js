import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Append div id app
const rootElement = document.createElement('div')
rootElement.id = 'app'
document.body.appendChild(rootElement)

// Render your React component instead
const root = createRoot(document.getElementById('app'))
root.render(<App />)
