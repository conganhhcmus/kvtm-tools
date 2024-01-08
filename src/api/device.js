const fs = require('fs')
const path = require('path')

exports.getRunningDevice = function (req, res, next) {
    var data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'))
    res.json(data)
}
