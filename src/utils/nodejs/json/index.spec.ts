// https://gitlab.com/divramod/yagpt/issues/4
// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UJson as U_INSTANCE, UJsonUtility as U_CLASS } from './'

// REQUIRE
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

// TESTSUITE
describe(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    describe('UJson.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe('UJson.getKeyValueFromFile()', async () => {

        it([
            'success:',
            'key existant',
        ].join(' '), async () => {
            const R =
                await U_INSTANCE.getKeyValueFromFile(
                    PATH.resolve(
                        process.cwd(),
                        'yagpt.config.json',
                    ),
                    'name',
                )
            expect(R).to.equal('yagpt')
        })

        it([
            'success:',
            'key not existant',
        ].join(' '), async () => {
            const FILE_PATH = PATH.resolve(
                process.cwd(),
                'yagpt.config.json',
            )
            const R =
                await U_INSTANCE.getKeyValueFromFile(
                    FILE_PATH,
                    'blubbi',
                )
            expect(R).to.equal( [
                'blubbi',
                'not existant in',
                FILE_PATH + '!',
            ].join(' ') )
        })

        it([
            'error:',
            'file not existant!',
        ].join(' '), async () => {
            const R =
                await U_INSTANCE.getKeyValueFromFile(
                    PATH.resolve(
                        process.cwd(),
                        'somefile.json',
                    ),
                    'name',
                )
            expect(R).to.equal([
                PATH.resolve(
                    process.cwd(),
                    'somefile.json',
                ),
                'not existant!',
            ].join(' '))
        })
    })

})
