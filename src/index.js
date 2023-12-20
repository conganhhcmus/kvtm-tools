const Promise = require("bluebird");
const ADB = require("adbkit");
const Auto = require("./auto");
const moment = require("moment");


const RunAuto = (client) => {
    const NUMBER_LOOPS = 10;
    const RESET_AFTER_LOOPS = 2;
    const NUMBER_OF_MAKE_GOODS = 2 * 10;

    for (let i = 0; i < NUMBER_LOOPS; i++) {
        Auto.OpenGame(client);
        for (var j = 0; j < RESET_AFTER_LOOPS; j++) {
            for (var k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
                // Plant
                Auto.GoUp(client);
                Auto.PlantTrees(client, 3);

                // Auto.GoUp(client, 2);
                // Auto.PlantTrees(client, 1);

                Auto.GoUp(client, 2);
                Auto.PlantTrees(client, 0);

                Auto.GoDownLast(client);
                Auto.Sleep(client, 4);
                Auto.GoUp(client);

                // Harvest
                Auto.HarvestTrees(client);
                Auto.GoUp(client, 2);
                // Auto.HarvestTrees(client);
                // Auto.GoUp(client, 2);
                Auto.HarvestTrees(client);
                Auto.GoDownLast(client);
                Auto.GoUp(client);

                // Make Goods
                Auto.MakeGoods(client, 2, 4);
                Auto.GoUp(client);
                //Auto.MakeGoods(client, 0, 3);
                Auto.GoUp(client);
                Auto.MakeGoods(client, 2, 4);

                Auto.BackToGame(client);
                Auto.GoDownLast(client);

                Auto.Sleep(client, 4);
            }

            // Sell Goods
            Auto.SellGoods(client, [0, 1, 2, 3, 4, 5, 6, 7], () => {
                console.log("Done at " + moment().format("LTS"));
            });
        }
    }
    client.end();
};

const Main = () => {
    //$ adb shell kill $(adb shell pgrep monkey)

    var client = ADB.createClient();

    client.listDevices()
        .then((devices) => Promise.map(devices, (device) =>
            client.shell(device.id, "kill $(pgrep monkey)").then(() =>
                client.shell(device.id, "nohup monkey --port 1080 &").then(() =>
                    client.forward(device.id, "tcp:1080", "tcp:1080").then(() =>
                        client.openMonkey(device.id).then(monkey => {
                            console.log('Running on "%s"', device.id);
                            RunAuto(monkey);
                        })
                    )
                )
            )
        ))
        .then(() => {
            console.log('Done !!!');
        }).catch((err) => {
            console.error('Error:', err.stack);
        });
}

// Run Main Function
Main();