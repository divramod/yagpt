import { UConfig } from '@utils/yagpt/config'
import { describe, expect, it, UTest } from '@utils/yagpt/test'
import { UPackage as U_INSTANCE } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

describe(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UConfig.testPath)
    })

    afterEach(async () => {
        RIMRAF.sync(UConfig.testPath)
    })

    describe.skip('runProgram()', async () => {

        it([
            '1. boolean=true:',
        ].join(' '), async () => {
            const R: boolean | string = await U_INSTANCE.run()
            expect(R).to.equal(false)
        })

    })

    describe('parseProgramArguments()', async () => {

        it([
            '0 runTask()',
        ].join(' '), async () => {
            const R = await U_INSTANCE.parseProgramArguments(
                'npm',
                'publish',
            )
            expect(R).to.equal(0)
        })

        it([
            '1 runYagptPrompt()',
        ].join(' '), async () => {
            const R = await U_INSTANCE.parseProgramArguments()
            expect(R).to.equal(1)
        })

        it([
            '2 printModuleHelp()',
        ].join(' '), async () => {
            const R = await U_INSTANCE.parseProgramArguments(
                'npm',
                'notExistantTask',
            )
            expect(R).to.equal(2)
        })

        it([
            '3 runModulePrompt()',
        ].join(' '), async () => {
            const R = await U_INSTANCE.parseProgramArguments(
                'npm',
            )
            expect(R).to.equal(3)
        })

        it([
            '4 printGeneralHelp()',
        ].join(' '), async () => {
            const R = await U_INSTANCE.parseProgramArguments(
                'notExistantModule',
            )
            expect(R).to.equal(4)
        })

    })

})
