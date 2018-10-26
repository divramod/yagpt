import { UGit } from '@utils/nodejs/git'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { ITaskClass, ITaskConstructorParams, SuperTask } from './'

// REQUIRE
const RIMRAF = require('rimraf')
const _ = require('underscore')

// TEST CLASS Task
class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({ name: 'Test', cwd: opts.cwd, logging: opts.logging || false })
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

describe(__filename, async () => {

    beforeEach(async () => {
        await RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        await RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    it('run()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.run()
        expect(R.subresults.someResult1.value).to.equal(true)
        expect(R.subresults.someResult2.value).to.equal(false)

    })

    it('constructor()', async () => {

        const T = new Task({ cwd: __dirname})
        expect(T).to.deep.equal(T)

    })

    it('printName()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.printName()
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = T1.printName()
        expect(R1).to.equal(true)

    })

    it('getTaskPath()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.getTaskPath()
        expect(R).to.equal('@utils/nodejs/task')

    })

    it('getName()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.getName()
        expect(R).to.equal('Test')

    })

    it('async runBefore()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.runBefore()
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = await T1.runBefore()
        expect(R1).to.equal(true)
    })

    it('async runAfter()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.runAfter()
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = await T1.runAfter()
        expect(R1).to.equal(true)

    })

    it('logValue()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.logValue('', '')
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = T1.logValue('', '')
        expect(R1).to.equal(true)
    })

    it('logHeader()', async () => {
        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.logHeader('', '')
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = T1.logHeader('', '')
        expect(R1).to.equal(true)
    })

})
