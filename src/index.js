const moment = require("moment");
const forever = require('forever-monitor');
const { exec } = require("child_process");

const frequency = 1;
const excludeDevices = []; //['emulator-5554', 'emulator-5556'];
const gameOptions = {
    hasEventTrees: true,
    resetAfterLoops: 2,
}
var runningDevices = [];

const child = new (forever.Monitor)('auto.js', {
    max: frequency,
    silent: false,
    args: [JSON.stringify(gameOptions), JSON.stringify(excludeDevices)]
});

child.on('start', function () {
    exec("adb devices | grep emulator | cut -f1", (err, stdout) => {
        const listDevices = stdout.trim("\n").split("\n");
        runningDevices = listDevices.filter(device => !excludeDevices.includes(device));
        console.log(`Running on [${runningDevices}]`);
    });
    console.error('Start at ' + moment().format("LTS"));
});

child.on('restart', function () {
    console.error('Restart ' + child.times + ' times at ' + moment().format("LTS"));
});

child.on('exit', function () {
    console.log('Exits!!!');
});

child.start();

// stop auto when Ctrl + C
process.on('SIGINT', function () {
    console.log(`\nStop Devices: [${runningDevices}]`);
    runningDevices.forEach(device => exec(`adb -s ${device} shell kill $(adb -s ${device} shell pgrep monkey)`));

    process.exit();
})