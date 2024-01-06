const express = require('express')
const router = require('./router')
const path = require('path')
const app = express()
const port = 8080

// UI
app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.json())

// API
app.use('/api', router)

// Error Handler

app.listen(port, function () {
    console.log('Your app running on http://localhost:' + port)
})
