const Promise = require("bluebird");
const ADB = require("adbkit");
const Scripts = require("./scripts");
const Helpers = require("./helpers");

class Device {
    constructor(id, client, size) {
        this.id = id;
        this.client = client;
        this.size = size;
    }

    Calculator() {
        const calc_X = (x) => Helpers.calc_X(x, this.size);
        const calc_Y = (y) => Helpers.calc_Y(y, this.size);
        return [calc_X, calc_Y];
    }

    RunAuto(gameOptions = {}) {
        const { hasEventTrees, resetAfterLoops } = gameOptions;
        const RESET_AFTER_LOOPS = resetAfterLoops > 0 ? resetAfterLoops : 1;
        const NUMBER_OF_MAKE_GOODS = 2 * 10;

        Scripts.OpenGame(this);

        for (var j = 0; j < RESET_AFTER_LOOPS; j++) {
            for (var k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
                // Floor 1
                Scripts.GoUp(this);
                Scripts.HarvestTrees(this);
                if (hasEventTrees) {
                    Scripts.NextTrees(this, 1);
                    Scripts.PlantTrees(this, 2);
                } else {
                    Scripts.PlantTrees(this, 3);
                }
                Scripts.MakeGoods(this, 2, 4);

                // Floor 3
                Scripts.GoUp(this, 2);
                Scripts.HarvestTrees(this);
                hasEventTrees && Scripts.PrevTrees(this, 1);
                Scripts.PlantTrees(this, 0);
                Scripts.MakeGoods(this, 2, 4);

                // Go Down
                Scripts.BackToGame(this);
                Scripts.GoDownLast(this);
                Scripts.Sleep(this, 14);
            }

            // Sell Goods
            Scripts.SellGoods(this, [0, 1, 2, 3, 4, 5, 6, 7], 1);
        }

        Scripts.Sleep(this, 1, () => {
            this.client.end();
        });
    };
}

const Main = (gameOptions = {}, excludeDevices = []) => {
    var client = ADB.createClient();
    client.listDevices()
        .then((devices) => Promise.map(devices.filter(device => !excludeDevices.includes(device.id)), (device) =>
            client.shell(device.id, "kill $(pgrep monkey)").then(() =>
                client.shell(device.id, "nohup monkey --port 1080 &").then(() =>
                    client.forward(device.id, "tcp:1080", "tcp:1080").then(() =>
                        client.shell(device.id, "wm size").then(ADB.util.readAll).then(output =>
                            client.openMonkey(device.id).then(monkey => {
                                var runningDevice = new Device(device.id, monkey, Helpers.getSize(output.toString()));
                                runningDevice.RunAuto(gameOptions);
                            })
                        )
                    )
                )
            )
        ))
}

//Run Main Function
Main(JSON.parse(process.argv[2]), JSON.parse(process.argv[3]));