import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UNpm as U_INSTANCE, UNpmUtility as U_CLASS } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

describe('yaNpm: ' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    describe('relink()', async () => {
        it([
            '1. boolean=true: if everything went fine',
        ].join(' '), async () => {
            const R_PREPARE_NPM_REPOSITORY =
                await UTest.prepareNpmRepository(
                )
            const R = await U_INSTANCE.relink(
                UTest.npmPackage.path,
                UTest.npmPackage.name,
            )
            expect(R).to.equal(true)
        }).timeout(20000)

        it([
            '2. string=ERROR: `packagePath` not existant!',
        ].join(' '), async () => {
            RIMRAF.sync(UTest.npmPackage.path) // REMOVE DIRECTORY
            const R = await U_INSTANCE.relink(
                UTest.npmPackage.path,
                UTest.npmPackage.name,
            )
            expect(R).to.equal([
                'ERROR:',
                UTest.npmPackage.path,
                'not existant!',
            ].join(' '))
        })
    })
})
