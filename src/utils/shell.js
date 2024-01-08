const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const path = require('path')

exports.runShell = async (command) => {
    try {
        const { stdout, stderr, error } = await exec(command)
        stdout && fs.appendFileSync(path.resolve(__dirname, '../logs/out.txt'), stdout)
        stderr && fs.appendFileSync(path.resolve(__dirname, '../logs/err.txt'), stderr)
        return stdout || stderr
    } catch (e) {
        fs.appendFileSync(path.resolve(__dirname, '../logs/err.txt'), e.message)
        return e.message
    }
}
