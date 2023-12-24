const moment = require("moment");
const forever = require('forever-monitor');
const { exec } = require("child_process");

const NUMBER_OF_LOOPS = 20;
var listDevices = [];

const child = new (forever.Monitor)('auto.js', {
    max: NUMBER_OF_LOOPS,
    silent: true,
    args: []
});

child.on('start', function () {
    exec("adb devices | grep emulator | cut -f1", (err, stdout) => {
        listDevices = stdout.trim("\n").split("\n");
    });
    console.error('Start at ' + moment().format("LTS"));
});

child.on('restart', function () {
    console.error('Restart ' + child.times + ' time at ' + moment().format("LTS"));
});

child.on('exit', function () {
    console.log('Exits!!!');
});

child.start();

// stop auto when Ctrl + C
process.on('SIGINT', function () {
    console.log("\nStop Devices: " + listDevices);
    listDevices.forEach(device => exec(`adb -s ${device} shell kill $(adb -s ${device} shell pgrep monkey)`));

    process.exit();
})