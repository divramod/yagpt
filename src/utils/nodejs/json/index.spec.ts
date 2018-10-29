import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UJson as U_INSTANCE, UJsonUtility as U_CLASS } from './'

const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

describe('UJson:' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.testPath) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.testPath) // REMOVE DIRECTORY
    })

    describe('getKeyValueFromFile()', async () => {
        it([
            '1. object',
        ].join(' '), async () => {
            const R = await U_INSTANCE.getKeyValueFromFile(
                PATH.resolve(
                    process.cwd(),
                    'yagpt.config.json',
                ),
                'tasks',
            )
            expect(R).to.be.an('object')
        })

        it([
            '3. string=ERROR: `keyName` not existant in `filePath`',
        ].join(' '), async () => {
            const FILE_PATH = PATH.resolve(
                process.cwd(),
                'yagpt.config.json',
            )
            const R = await U_INSTANCE.getKeyValueFromFile(
                FILE_PATH,
                'blubbi',
            )
            expect(R).to.equal( [
                'ERROR:',
                'blubbi',
                'not existant in',
                FILE_PATH + '!',
            ].join(' ') )
        })

        it([
            '4. string=ERROR: `filePath`not existant',
        ].join(' '), async () => {
            const R = await U_INSTANCE.getKeyValueFromFile(
                PATH.resolve(
                    process.cwd(),
                    'somefile.json',
                ),
                'name',
            )
            expect(R).to.equal([
                'ERROR:',
                PATH.resolve(
                    process.cwd(),
                    'somefile.json',
                ),
                'not existant!',
            ].join(' '))
        })

        it([
            '6. whole file',
        ].join(' '), async () => {
            const R = U_INSTANCE.getKeyValueFromFile(
                PATH.resolve(
                    process.cwd(),
                    'yagpt.config.json',
                ),
            )
            expect(R).to.be.an('object')
        })
    })

})
