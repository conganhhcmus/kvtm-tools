const Promise = require('bluebird')
const ADB = require('adbkit')
const Helpers = require('./helpers')
const Client = ADB.createClient()
const AutoFunc = require('./modules/autoFunc')

const { AutoOptions } = require('./constants')

class Device {
    constructor(id, monkey, vmSize) {
        this.id = id
        this.size = Helpers.getSize(vmSize.toString())
        this.monkey = monkey
        this.client = this.monkey.multi()
    }

    Calculator() {
        const calc_X = (x) => Helpers.calc_X(x, this.size)
        const calc_Y = (y) => Helpers.calc_Y(y, this.size)
        return [calc_X, calc_Y]
    }

    RunAuto(gameOptions = {}) {
        const { resetAfterLoops, runAuto, hasEventTrees, hasOpenGame } = gameOptions
        const RESET_AFTER_LOOPS = resetAfterLoops > 0 ? resetAfterLoops : 1

        hasOpenGame && AutoFunc.OpenGame(this)

        for (let i = 0; i < RESET_AFTER_LOOPS; i++) {
            switch (runAuto) {
                case AutoOptions.PlantEventTree:
                    AutoFunc.PlantEventTree(this)
                    break

                default:
                    AutoFunc.ProduceAndSellItems(this, hasEventTrees)
                    break
            }
        }

        AutoFunc.Execute(this)
    }
}

const CreateDevice = async (device) => {
    let output = [device.id]
    // kill all process monkey
    output.push(await Client.shell(device.id, 'kill $(pgrep monkey)').then(ADB.util.readAll))
    output.push(await Client.shell(device.id, 'nohup monkey --port 1080 &').then(ADB.util.readAll))
    output.push(await Client.forward(device.id, 'tcp:1080', 'tcp:1080'))
    console.log(output.map((x) => x.toString()))

    let vmSize = await Client.shell(device.id, 'wm size').then(ADB.util.readAll)
    let monkey = await Client.openMonkey(device.id)

    return new Device(device.id, monkey, vmSize)
}

const Main = async (gameOptions = {}, excludeDevices = []) => {
    let listDevices = await Client.listDevices().then((devices) => devices.filter((device) => !excludeDevices.includes(device.id)))

    return Promise.map(listDevices, async (device) => {
        let runningDevice = await CreateDevice(device)
        return runningDevice.RunAuto(gameOptions)
    })
}

//Run Main Function
Main(JSON.parse(process.argv[2]), JSON.parse(process.argv[3]))
