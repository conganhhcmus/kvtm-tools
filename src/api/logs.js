const fs = require('fs')
const path = require('path')

exports.getLogs = (req, res, next) => {
    let device = req.query.device
    let logs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/logs.json'), 'utf8'))
    let result = logs.find((log) => log.device === device)
    res.json(result)
}

exports.clearLogs = (req, res, next) => {
    fs.writeFileSync(path.resolve(__dirname, '../data/logs.json'), '')
    res.end()
}
