import { UConfig } from '@utils/nodejs/config'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UCommander as U_INSTANCE } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

describe.skip(__filename, async () => {

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
            const R: boolean | string = await U_INSTANCE.runProgram()
            expect(R).to.equal(false)
        })

    })

})
