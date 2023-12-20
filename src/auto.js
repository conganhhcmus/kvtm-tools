const Promise = require("bluebird");
const ADB = require("adbkit");
const Scripts = require("./scripts");


const RunAuto = (client) => {
    const RESET_AFTER_LOOPS = 2;
    const NUMBER_OF_MAKE_GOODS = 2 * 10;

    Scripts.OpenGame(client);
    
    for (var j = 0; j < RESET_AFTER_LOOPS; j++) {
        for (var k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
            // Plant
            Scripts.GoUp(client);
            Scripts.PlantTrees(client, 3);

            Scripts.GoUp(client, 2);
            Scripts.PlantTrees(client, 0);

            Scripts.GoDownLast(client);
            Scripts.Sleep(client, 5);
            Scripts.GoUp(client);

            // Harvest
            Scripts.HarvestTrees(client);
            Scripts.GoUp(client, 2);

            Scripts.HarvestTrees(client);
            Scripts.GoDownLast(client);
            Scripts.GoUp(client);

            // Make Goods
            Scripts.MakeGoods(client, 2, 4);
            Scripts.GoUp(client);

            Scripts.GoUp(client);
            Scripts.MakeGoods(client, 2, 4);

            Scripts.BackToGame(client);
            Scripts.GoDownLast(client);

            Scripts.Sleep(client, 4);
        }

        // Sell Goods
        Scripts.SellGoods(client, [0, 1, 2, 3, 4, 5, 6, 7]);
    }

    Scripts.Sleep(client, 1, () => {
        client.end();
    });
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
}

// Run Main Function
Main();