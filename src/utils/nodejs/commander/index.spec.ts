import { UConfig } from '@utils/nodejs/config'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UCommander as U_INSTANCE } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

describe.only(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UConfig.testPath)
    })

    afterEach(async () => {
        RIMRAF.sync(UConfig.testPath)
    })

    describe('runProgram()', async () => {

        it([
            '1. boolean=true:',
        ].join(' '), async () => {
            const R: boolean | string = await U_INSTANCE.run()
            expect(R).to.equal(false)
        })

    })

    describe.only('checkIfModuleTaskExistant()', async () => {

        it([
            '0 runTask()',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkIfModuleTaskExistant(
                'npm',
                'publish',
            )
            expect(R).to.equal(0)
        })

        it([
            '1 runYagptPrompt()',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkIfModuleTaskExistant()
            expect(R).to.equal(1)
        })

        it([
            '2 printModuleHelp()',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkIfModuleTaskExistant(
                'npm',
                'notExistantTask',
            )
            expect(R).to.equal(2)
        })

        it([
            '3 runModulePrompt()',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkIfModuleTaskExistant(
                'npm',
            )
            expect(R).to.equal(3)
        })

        it([
            '4 printGeneralHelp()',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkIfModuleTaskExistant(
                'notExistantModule',
            )
            expect(R).to.equal(4)
        })

    })

})
