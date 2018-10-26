// https://gitlab.com/divramod/dm-tpl/issues/4
// IMPORT
import {
    describe,
    expect,
    it,
    UTest,
} from '@utils/nodejs/test'
import { UNpm as U_INSTANCE, UNpmUtility as U_CLASS } from './'
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
            RIMRAF.sync(UTest.npmPackage.path)
            const R_PREPARE_NPM_REPOSITORY =
                await UTest.prepareNpmRepository()
            const R = await U_INSTANCE.relink(
                UTest.npmPackage.path,
                UTest.npmPackage.name,
            )
            expect(R).to.equal(true)
        }).timeout(20000)

        it([
            'error:',
            'package not existant on file system',
        ].join(' '), async () => {
            RIMRAF.sync(UTest.npmPackage.path)
            const R = await U_INSTANCE.relink(
                UTest.npmPackage.path,
                UTest.npmPackage.name,
            )
            expect(R).to.equal( [
                UTest.npmPackage.path,
                'not relinked (not existant)!',
            ].join(' ') )
        })

    }).timeout(10000)

})
