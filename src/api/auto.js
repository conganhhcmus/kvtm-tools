const moment = require('moment')
const fs = require('fs')
const path = require('path')
const { runShell } = require('../utils/shell')
const games = require('../const/game')
const auto = require('../const/auto')

exports.stopAuto = async (req, res, next) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'))
    let device = req.body.device
    let command = `adb -s ${device} shell kill $(adb -s ${device} shell pgrep monkey)`
    await runShell(command)
    data = data.filter((x) => x.device !== device)

    fs.writeFileSync(path.resolve(__dirname, '../data/data.json'), JSON.stringify(data))

    res.json(data)
}

exports.stopAllAuto = async (req, res, next) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'))
    let listDevices = req.body.listDevices

    for await (const device of listDevices) {
        let command = `adb -s ${device} shell kill $(adb -s ${device} shell pgrep monkey)`
        await runShell(command)
        data = data.filter((x) => x.device !== device)
    }

    fs.writeFileSync(path.resolve(__dirname, '../data/data.json'), JSON.stringify(data))

    res.json(data)
}

exports.startAuto = (req, res, next) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'))
    let payload = req.body
    let newData = []
    payload.selectedDevices.forEach((device) => {
        newData.push({
            device: device,
            game: games.listGameOption.find((x) => x.key === payload.selectedGame).name,
            runAuto: auto[payload.selectedGame].find((x) => x.key === payload.gameOptions.runAuto).name,
            gameOptions: payload.gameOptions,
        })
    })
    data = data.concat(newData)
    fs.writeFileSync(path.resolve(__dirname, '../data/data.json'), JSON.stringify(data))
    startAuto(payload)
    res.json(data)
}

exports.getState = function (req, res, next) {}

const startAuto = async (payload) => {
    const { selectedDevices, selectedGame } = payload
    const { frequency, openGameAfter, openGame } = payload.gameOptions
    let logs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/logs.json'), 'utf8'))

    // clear old logs
    logs = logs.filter((log) => !selectedDevices.includes(log.device))
    logs = logs.concat(selectedDevices.map((device) => ({ device: device, logs: '' })))
    fs.writeFileSync(path.resolve(__dirname, '../data/logs.json'), JSON.stringify(logs))

    let logDevices = logs.filter((x) => selectedDevices.includes(x.device))
    let command = ''
    for (let i = 0; i < frequency; i++) {
        // write logs
        logs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/logs.json'), 'utf8'))
        logDevices = getDeviceLogs(selectedDevices, logs)

        logDevices.forEach((logDevice) => (logDevice.logs += 'Run ' + (i + 1) + ' times at ' + moment().format('LTS') + '\n'))
        fs.writeFileSync(path.resolve(__dirname, '../data/logs.json'), JSON.stringify(logs))

        // run auto
        let gameState = await getPayload(payload)
        if (openGame && i % openGameAfter === 0) {
            command = `node src/auto/${selectedGame}/index.js '${openGame}' '${JSON.stringify(gameState)}'`
            await runShell(command)
        }
        gameState = await getPayload(payload)
        command = `node src/auto/${selectedGame}/index.js '${false}' '${JSON.stringify(gameState)}'`
        await runShell(command)
    }
    // write logs
    logs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/logs.json'), 'utf8'))
    logDevices = getDeviceLogs(selectedDevices, logs)
    logDevices.forEach((logDevice) => (logDevice.logs += 'Exist!!!\n'))
    fs.writeFileSync(path.resolve(__dirname, '../data/logs.json'), JSON.stringify(logs))

    // remove running list
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'))
    data = data.filter((x) => !selectedDevices.includes(x.device))
    fs.writeFileSync(path.resolve(__dirname, '../data/data.json'), JSON.stringify(data))
}

const getPayload = async (payload) => {
    const { selectedDevices } = payload
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'))
    let listRunningDevice = data.filter((x) => selectedDevices.includes(x.device)).map((x) => x.device)

    return {
        ...payload,
        selectedDevices: listRunningDevice,
    }
}

const getDeviceLogs = (selectedDevices, logs) => {
    let logDevices = logs.filter((x) => selectedDevices.includes(x.device))
    let listRunningDevice = getRunningDevices(selectedDevices)
    let stoppedDevicesLog = logDevices.filter((log) => !listRunningDevice.includes(log.device))
    stoppedDevicesLog.forEach((logDevice) => {
        let logString = logDevice.logs.replaceAll('Exist!!!\n', '') + 'Exist!!!\n'
        logDevice.logs = logString
    })

    return logDevices.filter((log) => listRunningDevice.includes(log.device))
}

const getRunningDevices = (selectedDevices) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'))
    let listRunningDevice = data.filter((x) => selectedDevices.includes(x.device)).map((x) => x.device)
    return listRunningDevice
}
