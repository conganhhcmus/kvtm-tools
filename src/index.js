const moment = require('moment')
const forever = require('forever-monitor')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const { AutoOptions } = require('./constants')

const frequency = 100
const excludeDevices = [] //['emulator-5556']
const gameOptions = {
    hasEventTrees: true,
    resetAfterLoops: 1,
    hasOpenGame: true,
    runAuto: AutoOptions.ProduceAndSellItems,
}
let runningDevices = []

const child = new forever.Monitor('auto.js', {
    max: frequency,
    silent: true,
    sourceDir: 'src',
    outFile: `logs/out.txt`,
    errFile: `logs/err.txt`,
    args: [JSON.stringify(gameOptions), JSON.stringify(excludeDevices)],
})

child.on('start', async function () {
    let result = await exec('adb devices | grep emulator | cut -f1')
    let listDevices = result.stdout.trim('\n').split('\n')
    runningDevices = listDevices.filter((device) => !excludeDevices.includes(device))

    console.log(`Running on [${runningDevices}]`)
    console.log('Start at ' + moment().format('LTS'))
})

child.on('restart', function () {
    console.log('Restart ' + child.times + ' times at ' + moment().format('LTS'))
})

child.on('exit', function () {
    console.log('Exits!!!')
})

child.start()

// stop auto when Ctrl + C
process.on('SIGINT', function () {
    console.log(`\nStop Devices: [${runningDevices}]`)
    runningDevices.forEach((device) => exec(`adb -s ${device} shell kill $(adb -s ${device} shell pgrep monkey)`))

    process.exit()
})
