import { UGit } from '@utils/nodejs/git'
import { ULogger } from '@utils/nodejs/logger'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { ITask, ITaskConstructorParams, TaskUtility } from './'

// REQUIRE
const RIMRAF = require('rimraf')
const _ = require('underscore')

// TEST CLASS TestTask
class TestTask extends TaskUtility implements ITask {

    constructor() {
        super()
        this.name = 'TestTask'
    }

    public async isRunnable(): Promise<any> {
        return true
    }

    public async run(): Promise<any> {
        // PREPARE
        await super.runBefore()

        // RUN
        const RESULT_MAIN = {
            message: undefined,
            subresults: {
                someResult1: undefined,
                someResult2: undefined,
            },
            value: undefined,
        }

        // PRODUCE SUB RESULT
        const someResult1 = {
            value: true,
        }
        RESULT_MAIN.subresults.someResult1 = someResult1

        // PRODUCE SUB RESULT
        const someResult2 = {
            value: true,
        }
        RESULT_MAIN.subresults.someResult2 = someResult2

        // PRODUCE RESULT
        RESULT_MAIN.value = true
        RESULT_MAIN.message = 'message'

        // FINISH
        await super.runAfter()

        // RETURN
        return RESULT_MAIN
    }

}

describe('UTask ' + __filename, async () => {

    beforeEach(async () => {
        await RIMRAF.sync(UTest.testPath) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        await RIMRAF.sync(UTest.testPath) // REMOVE DIRECTORY
    })

    describe('constructor()', async () => {
        it('1. constructor()', async () => {
            const T = new TestTask()
            expect(T).to.deep.equal(T)
        })
    })

    describe('runBefore()', async () => {
        it('async runBefore()', async () => {
            const T = new TestTask()
            const R = await T.runBefore()
            expect(R).to.equal(undefined)
        })
    })

    describe('runAfter()', async () => {
        it('async runAfter()', async () => {
            const T = new TestTask()
            const R = await T.runAfter()
            expect(R).to.equal(undefined)
        })
    })

})
