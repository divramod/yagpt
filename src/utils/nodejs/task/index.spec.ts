const RIMRAF = require('rimraf')
const _ = require('underscore')
import { UGit } from '@utils/nodejs/git'
import { ULogger } from '@utils/nodejs/logger'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { ITask, UTask } from './'

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
            expect(R).to.equal(true)
        })
    })

    describe('runAfter()', async () => {
        it('async runAfter()', async () => {
            const T = new TestTask()
            const R = await T.runAfter()
            expect(R).to.equal(true)
        })
    })

    describe('runTask() includes printStepLog()', async () => {

        it([
            '1. boolean=true printStepLog=true',
        ].join(' '), async () => {
            const T = new TestTask()
            const R = await T.runTask(true)
            expect(R.value).to.equal(true)
        })

        it([
            '2. boolean=true printStepLog=false',
        ].join(' '), async () => {
            const T = new TestTask()
            const R = await T.runTask(true)
            expect(R.value).to.equal(true)
        })

        it([
            '3. boolean=false',
        ].join(' '), async () => {
            const T = new TestTask(true)
            const R = await T.runTask()
            expect(R.value).to.equal(true)
        })

        it([
            '4. boolean=false',
        ].join(' '), async () => {
            const T = new TestTask(false, true)
            const R = await T.runTask()
            expect(R.value).to.equal(false)
        })

    })

})

/**
 * A class for testing the TaskUtility class. It contains of a switch for in the
 * contructor for beeing able to test the throwing of an error from inside a
 * step.
 */
class TestTask extends UTask implements ITask {

    private errorSwitchRun: boolean
    private errorSwitchCheck: boolean

    constructor(
        errorSwitchRun: boolean = false,
        errorSwitchCheck: boolean = false,
    ) {
        super()
        super.setChild(this)
        this.name = 'TestTask'
        this.errorSwitchRun = errorSwitchRun
        this.errorSwitchCheck = errorSwitchCheck
    }

    public async checkPrerequisites(): Promise<any> {
        const RESULT = {
            isCheck: undefined,
        }
        if (this.errorSwitchCheck === true) {
            RESULT.isCheck = 'ERROR: checkPrerequisites error'
        } else {
            RESULT.isCheck = true
        }
        return RESULT
    }

    public async runSteps(): Promise<any> {
        // step
        await super.runStep({
            comment: 'runs a test step',
            name: 'testStep',
        }, async () => {
            return await true
        })
        // step
        await super.runStep({}, async () => {
            return await true
        })
        await super.runStep({
            comment: 'runs a test step',
            hide: true,
            name: 'testStep',
        }, async () => {
            return await true
        })
        await super.runStep({
            comment: 'runs a test step',
            name: 'testStep',
            run: false,
        }, async () => {
            return true
        })
        if (this.errorSwitchRun === true) {
            // step
            await super.runStep({
                comment: 'runs a test step',
                hide: true,
                name: 'testStep',
            }, async () => {
                throw new Error('Error: test Error')
                return 'ERROR: a step which throws an error'
            })
        }
    }
}
