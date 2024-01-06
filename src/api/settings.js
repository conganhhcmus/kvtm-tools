const fs = require('fs')
const path = require('path')
const { runShell } = require('../utils/shell')
const games = require('../const/game')
const auto = require('../const/auto')

exports.getSettings = async function (req, res, next) {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'))

    let runningDevices = data.map((x) => x.device)
    let output = await runShell('adb devices | grep emulator | cut -f1')
    let listDevices = !!output ? output.trim('\n').split('\n') : []
    let result = {
        listDevices: listDevices.map((device) => ({
            value: device,
            label: device,
            disabled: runningDevices.includes(device),
        })),
        listGameOption: [...games.listGameOption],
    }
    res.json(result)
}

exports.getGameOptions = function (req, res, next) {
    let game = req.query.game
    let result = auto.hasOwnProperty(game) ? auto[game] : []
    res.json(result)
}
