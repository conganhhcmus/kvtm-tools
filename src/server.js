const express = require('express')
const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { AutoFuncOptions } = require('./constants')
const path = require('path')
const app = express()
const port = 8080

let state = {
    isRunning: false,
    listDevices: [],
    listRunningDevice: [],
    gameOptions: {
        frequency: 1,
        resetAfterLoops: 1,
    },
    autoFunc: AutoFuncOptions,
    runningAutoFunc: AutoFuncOptions[0].key,
}

app.use(express.static(path.join(__dirname, 'web')))
app.use(express.json())

app.post('/start', function (req, res) {
    state = { ...state, ...req.body, isRunning: true, runningAutoFunc: req.body.gameOptions.runAuto }
    let excludeDevices = []
    exec(`node src/auto.js '${JSON.stringify(state.gameOptions)}' '${JSON.stringify(excludeDevices)}'`, () => {
        state.isRunning = false
    })

    res.json({ message: 'start auto successfully' })
})

app.post('/stop', function (req, res) {
    state.isRunning = false
    state.listRunningDevice.forEach((device) => exec(`adb -s ${device} shell kill $(adb -s ${device} shell pgrep monkey)`))
    res.json({ message: 'stop auto successfully' })
})

app.get('/logs', async function (req, res) {
    const data = fs.readFileSync('logs/out.txt', { encoding: 'utf8', flag: 'r' })
    res.json(data)
})

app.get('/init', async function (req, res) {
    let output = await exec('adb devices | grep emulator | cut -f1')
    state.listDevices = output.stdout.trim('\n').split('\n')

    res.send(JSON.stringify(state))
})

app.listen(port, function () {
    console.log('Your app running on port ' + port)
})
