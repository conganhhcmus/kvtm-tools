const Promise = require("bluebird");
const ADB = require("adbkit");
const Scripts = require("./scripts");
const Helpers = require("./helpers");
const Client = ADB.createClient();

const { AutoOptions } = require("./constants");

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
        const { runAuto, hasEventTrees, resetAfterLoops, hasOpenGame } =
            gameOptions;
        const RESET_AFTER_LOOPS = resetAfterLoops > 0 ? resetAfterLoops : 1;

        hasOpenGame && Scripts.OpenGame(this);

        for (let j = 0; j < RESET_AFTER_LOOPS; j++) {
            switch (runAuto) {
                case AutoOptions.PlantEventTree:
                    this.PlantEventTree();
                    break;

                default:
                    this.ProduceAndSellItems(hasEventTrees);
                    break;
            }
        }
        this.Close();
    }

    Close() {
        Scripts.Sleep(this, 0.5, () => {
            this.client.end();
        });
    }

    ProduceAndSellItems(hasEventTrees) {
        const NUMBER_OF_MAKE_GOODS = 2 * 10;

        for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
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
            Scripts.Sleep(this, 10);
        }

        // Sell Goods
        Scripts.SellGoods(this, [0, 1, 2, 3, 4, 5, 6, 7], 1);
    }

    PlantEventTree() {
        for (let i = 0; i < 4; i++) {
            Scripts.HarvestTrees(this);
            Scripts.PlantTrees(this, 4);
            Scripts.GoUp(this, 2);
        }

        Scripts.HarvestTrees(this);
        Scripts.PlantTrees(this, 4);
        Scripts.GoDownLast(this);
        Scripts.GoUp(this);
    }
}

const Main = (gameOptions = {}, excludeDevices = []) => {
    Client.listDevices().then((devices) =>
        Promise.map(
            devices.filter((device) => !excludeDevices.includes(device.id)),
            (device) =>
                Client
                    .shell(device.id, "kill $(pgrep monkey)")
                    .then(() => Client.shell(device.id, "wm size"))
                    .then(ADB.util.readAll)
                    .then((output) =>
                        Client.openMonkey(device.id).then((monkey) => {
                            let runningDevice = new Device(
                                device.id,
                                monkey,
                                Helpers.getSize(output.toString())
                            );
                            runningDevice.RunAuto(gameOptions);
                        })
                    )
        )
    );
};

//Run Main Function
Main(JSON.parse(process.argv[2]), JSON.parse(process.argv[3]));
