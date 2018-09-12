// https://gitlab.com/divramod/yagpt/issues/4
// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UJson as U_INSTANCE, UJsonUtility as U_CLASS } from './'

// REQUIRE
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

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

            // PREPARE

            // RUN
            const R: IResultOne =
                await U_INSTANCE.getKeyValueFromFile(
                    PATH.resolve(
                        process.cwd(),
                        'yagpt.config.json',
                    ),
                    'name',
                )

            // TEST
            expect(R.value).not.to.equal(undefined)
            expect(R.value).to.equal('yagpt')

        })

        it([
            'success:',
            'key not existant',
        ].join(' '), async () => {

            // PREPARE
            const FILE_PATH = PATH.resolve(
                process.cwd(),
                'yagpt.config.json',
            )

            // RUN
            const R: IResultOne =
                await U_INSTANCE.getKeyValueFromFile(
                    FILE_PATH,
                    'blubbi',
                )

            // TEST
            expect(R.success).to.equal(false)
            expect(R.message).to.equal( [
                'blubbi',
                'not existant in',
                FILE_PATH + '!',
            ].join(' ') )

        })

        it([
            'error:',
            'file not existant!',
        ].join(' '), async () => {

            // PREPARE

            // RUN
            const R: IResultOne =
                await U_INSTANCE.getKeyValueFromFile(
                    PATH.resolve(
                        process.cwd(),
                        'somefile.json',
                    ),
                    'name',
                )

            // TEST
            expect(R.success).to.equal(false)
            expect(R.message).to.equal([
                PATH.resolve(
                    process.cwd(),
                    'somefile.json',
                ),
                'not existant!',
            ].join(' '))

        })

    })

})
