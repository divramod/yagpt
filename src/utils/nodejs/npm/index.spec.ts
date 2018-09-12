// https://gitlab.com/divramod/dm-tpl/issues/4
// IMPORT
import {
    describe,
    expect,
    it,
    UTest,
} from '@utils/nodejs/test'
import { UNpm as U_INSTANCE, UNpmUtility as U_CLASS } from './'

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

    describe('UNpm.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    /**
     * success: relinked!
     * error: not relinked (not existant)!
     */
    describe('UNpm.relink()', async () => {

        it([
            'success:',
            'package existant!',
        ].join(' '), async () => {

            // PREPARE
            RIMRAF.sync(UTest.NPM_REPOSITORY.path)
            const R_PREPARE_NPM_REPOSITORY: IResultOne =
                await UTest.prepareNpmRepository()

            // RUN
            const R: IResultOne = await U_INSTANCE.relink(
                UTest.NPM_REPOSITORY.path,
                UTest.NPM_REPOSITORY.name,
            )

            // TEST
            expect(R.success).to.equal(true)
            expect(R.message).to.equal( [
                UTest.NPM_REPOSITORY.path,
                'relinked!',
            ].join(' ') )

        }).timeout(20000)

        it([
            'error:',
            'package not existant on file system',
        ].join(' '), async () => {

            // PREPARE
            RIMRAF.sync(UTest.NPM_REPOSITORY.path)

            // RUN
            const R: IResultOne = await U_INSTANCE.relink(
                UTest.NPM_REPOSITORY.path,
                UTest.NPM_REPOSITORY.name,
            )

            // TEST
            expect(R.success).to.equal(false)
            expect(R.message).to.equal( [
                UTest.NPM_REPOSITORY.path,
                'not relinked (not existant)!',
            ].join(' ') )

        })

    }).timeout(10000)

})
