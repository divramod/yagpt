export {}
import * as MOCHA from 'mocha'
// const filter =  MOCHA.utils.stackTraceFilter
const FS = require('fs')
const PATH = require('path')
const SHELL = require('shelljs')
const execSync = require('child_process').execSync

async function run() {
    const mocha = new MOCHA({
        fullStackTrace: false,
        // reporter: 'base',
        ui: 'tdd',
        useColors: true,
    })

    const testDir = __dirname + '/src'

    const FILES = SHELL.find('.').filter((file) => {
        return file.match(/\.spec\.ts$/)
    })
    FILES.forEach((file) => {
        delete require.cache[PATH.join(file)]
        mocha.addFile(
            PATH.join(file),
        )
    })

    mocha.run((failures) => {
        process.on('exit', () => {
            process.exit(failures)
        })
    })

}

run()
