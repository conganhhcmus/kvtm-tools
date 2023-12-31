const moment = require('moment')
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
        runAuto: AutoFuncOptions[0].key,
    },
    autoFunc: AutoFuncOptions,
}

app.use(express.static(path.join(__dirname, 'web')))
app.use(express.json())

app.post('/start', function (req, res) {
    fs.writeFileSync('logs/info.txt', '--- Welcome to KVTM Tools ---\n')
    state = { ...state, ...req.body, isRunning: true }

    Loops(state.gameOptions.frequency)

    res.end()
})

app.post('/stop', function (req, res) {
    fs.appendFileSync('logs/info.txt', 'Force Stop!!!\n')
    state.listRunningDevice.forEach(async (device) => {
        let command = `adb -s ${device} shell kill $(adb -s ${device} shell pgrep monkey)`
        await runShell(command)
    })
    state.isRunning = false
    res.end()
})

app.get('/logs', async function (req, res) {
    const data = fs.readFileSync('logs/info.txt', { encoding: 'utf8', flag: 'r' })
    res.json(data)
})

app.post('/clear', async function (req, res) {
    fs.writeFileSync('logs/info.txt', '--- Welcome to KVTM Tools!!! ---\n')
    res.end()
})

app.get('/init', async function (req, res) {
    let output = await exec('adb devices | grep emulator | cut -f1')
    state.listDevices = output.stdout.trim('\n').split('\n')

    res.send(JSON.stringify(state))
})

app.listen(port, function () {
    console.log('Your app running on port ' + port)
})

const runShell = async (command) => {
    try {
        const { stdout, stderr, error } = await exec(command)
        stdout && fs.appendFileSync('logs/out.txt', stdout)
        stderr && fs.appendFileSync('logs/err.txt', stderr)
        return stdout || stderr
    } catch (e) {
        fs.appendFileSync('logs/err.txt', e.message)
        return e.message
    }
}

const startAuto = async () => {
    const { resetAfterLoops, hasOpenGame } = state.gameOptions
    const RESET_AFTER_LOOPS = resetAfterLoops > 0 ? resetAfterLoops : 1
    if (!state.isRunning) return
    let command = `node src/auto/index.js ${hasOpenGame} '${JSON.stringify(state)}'`
    hasOpenGame && (await runShell(command))

    for (let i = 0; i < RESET_AFTER_LOOPS; i++) {
        if (!state.isRunning) return
        command = `node src/auto/index.js ${false} '${JSON.stringify(state)}'`
        await runShell(command)
    }
}

const Loops = async (num) => {
    for (let i = 0; i < num; i++) {
        if (!state.isRunning) return
        let data = 'Run ' + (i + 1) + ' times at ' + moment().format('LTS') + '\n'
        fs.appendFileSync('logs/info.txt', data)
        await startAuto()
    }
    if (!state.isRunning) return
    state.isRunning = false
    fs.appendFileSync('logs/info.txt', 'Exist!!!\n')
}
