const moment = require("moment");
const forever = require('forever-monitor');
const { exec } = require("child_process");

const NUMBER_OF_LOOPS = 50;

const child = new (forever.Monitor)('auto.js', {
    max: NUMBER_OF_LOOPS,
    silent: true,
    args: []
});

child.on('start', function () {
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
    exec("adb shell kill $(adb shell pgrep monkey)");
    process.exit();
})