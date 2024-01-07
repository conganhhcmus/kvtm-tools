const Promise = require('bluebird')
const ADB = require('adbkit')
const Helpers = require('./util')
const Client = ADB.createClient()
const AutoFunc = require('./func')

const auto = require('../../const/auto')['sky-garden']

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
        const { runAuto, hasEventTree } = gameOptions

        switch (runAuto) {
            case auto[0].key:
                AutoFunc.ProduceAndSellItems_1(this, hasEventTree)
                break

            case auto[1].key:
                AutoFunc.ProduceAndSellItems_2(this, hasEventTree)
                break

            case auto[2].key:
                AutoFunc.PlantEventTree(this)
                break

            default:
                break
        }

        AutoFunc.Execute(this)
    }

    OpenGame(gameOptions = {}) {
        const { openGame } = gameOptions
        openGame && AutoFunc.OpenGame(this)

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

const Main = async (openGame = 'false', state = {}) => {
    const { gameOptions, selectedDevices } = state
    let listDevices = await Client.listDevices().then((devices) => devices.filter((device) => selectedDevices.includes(device.id)))

    return Promise.map(listDevices, async (device) => {
        let runningDevice = await CreateDevice(device)
        return openGame === 'true' ? runningDevice.OpenGame(gameOptions) : runningDevice.RunAuto(gameOptions)
    })
}

//Run Main Function
Main(process.argv[2], JSON.parse(process.argv[3]))
