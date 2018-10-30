const RIMRAF = require('rimraf')
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UEnvironment as U_INSTANCE } from './'

// TESTSUITE
describe('UEnvironment ' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.testPath) // REMOVE DIRECTORY
        process.env.DMTPL_ENV = 'testing'
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.testPath) // REMOVE DIRECTORY
        process.env.DMTPL_ENV = 'testing'
    })

    describe('getEnv()', async () => {

        it([
            '1. should return the before set process environment',
        ].join(' '), async () => {
            process.env.DMTPL_ENV = 'testing'
            const R = await U_INSTANCE.getEnv()
            expect(R).to.equal('testing')
        })

    })

})
