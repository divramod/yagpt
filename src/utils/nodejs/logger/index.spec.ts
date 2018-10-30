import { UGit } from '@utils/nodejs/git'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { ULogger } from './'

// REQUIRE
const RIMRAF = require('rimraf')
const _ = require('underscore')

describe('ULogger ' + __filename, async () => {

    beforeEach(async () => {
        await RIMRAF.sync(UTest.testPath) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        await RIMRAF.sync(UTest.testPath) // REMOVE DIRECTORY
        ULogger.logging = false
    })

    describe('logValue()', async () => {

        it('1. boolean=true', async () => {
            ULogger.logging = true
            const R1 = ULogger.logValue('', '')
            ULogger.logging = false
            expect(R1).to.equal(true)
        })

        it('2. boolean=false', async () => {
            ULogger.logging = false
            const R1 = ULogger.logValue('', '')
            ULogger.logging = false
            expect(R1).to.equal(false)
        })

        it('3. boolean=true and theme existant', async () => {
            ULogger.logging = true
            const R = ULogger.logValue(
                'end:',
                'test',
                ULogger.LOG_VALUE_COLOR_THEME,
            )
            ULogger.logging = false
            expect(R).to.equal(true)
        })
    })

    describe('logHeader()', async () => {

        it('1. boolean=false', async () => {
            ULogger.logging = false
            const R = ULogger.logHeader('', '')
            ULogger.logging = false
            expect(R).to.equal(false)
        })

        it('2. boolean=true', async () => {
            ULogger.logging = true
            const R = ULogger.logHeader('', '')
            ULogger.logging = false
            expect(R).to.equal(true)
        })

        it('3. with offset, deviderLength and theme', async () => {
            ULogger.logging = true
            const R = ULogger.logHeader(
                this.name,
                '=',
                6,
                20,
                ULogger.LOG_HEADER_COLOR_THEME,
            )
            ULogger.logging = false
            expect(R).to.equal(true)
        })

    })

    describe('userInputCleanup()', async () => {
        it([
            '1. boolean=true: when cleanup was run and env=testing',
        ].join(' '), async () => {
            process.env.DMTPL_ENV = 'testing'
            console.log( // tslint:disable-line:no-console
                'the line to delete',
            )
            const R = await ULogger.userInputCleanup(1)
            expect(R).to.equal(true)
        })

        it([
            '2. boolean=false: env=something',
        ].join(' '), async () => {
            process.env.DMTPL_ENV = 'something'
            const R = await ULogger.userInputCleanup(1)
            process.env.DMTPL_ENV = 'testing'
            expect(R).to.equal(false)
        })

    })

})
