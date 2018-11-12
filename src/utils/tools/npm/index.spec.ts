import { UConfig } from '@utils/yagpt/config'
import { describe, expect, it } from '@utils/yagpt/test'
import { UNpm as U_INSTANCE, UNpmUtility as U_CLASS } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

describe('yaNpm: ' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UConfig.testPath) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UConfig.testPath) // REMOVE DIRECTORY
    })

    describe('relink()', async () => {
        it([
            '1. boolean=true: if everything went fine',
        ].join(' '), async () => {
            const TEST = await U_INSTANCE.prepareNpmRepository()
            const R = await U_INSTANCE.relink(
                UConfig.testPath,
                UConfig.config.testing.npm.name,
            )
            expect(R).to.equal(true)
        }).timeout(200000)

        it([
            '2. string=ERROR: `packagePath` not existant!',
        ].join(' '), async () => {
            RIMRAF.sync(UConfig.testPath) // REMOVE DIRECTORY
            const R = await U_INSTANCE.relink(
                UConfig.testPath,
                UConfig.config.testing.npm.name,
            )
            expect(R).to.equal([
                'ERROR:',
                UConfig.testPath,
                'not existant!',
            ].join(' '))
        })
    })

    describe('prepareNpmRepository()', async () => {

        it([
            '1. boolean=true',
        ].join(' '), async () => {
            const R = await U_INSTANCE.prepareNpmRepository()
            expect(R).to.equal(true)
        }).timeout(10000)

    })

})
