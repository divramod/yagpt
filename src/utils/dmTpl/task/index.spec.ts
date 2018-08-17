// https://gitlab.com/divramod/dm-tpl/issues/7
import { describe, expect, it } from '@utils/dmTpl/test/export'

import { SuperTask } from './'
import { ITaskClass, ITaskConstructorParams, ITaskRunResult, ITaskRunSubResult, ITaskRunSubResults } from './index.d'

// TEST RETURN INTERFACE for Task.run()
export interface ITestTaskRunSubResults extends ITaskRunSubResults {
    someResult1: ITaskRunSubResult
    someResult2: ITaskRunSubResult
}

// TEST CLASS Task
class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({ name: 'Test', cwd: opts.cwd, logging: opts.logging || false })
    }

    public async run(): Promise<ITaskRunResult> {
        // PREPARE
        await super.runBefore()

        // RUN

        const R: ITaskRunResult = super.getRunReturnObject()
        const R_SUB: ITestTaskRunSubResults = {
            someResult1: super.getRunSubResultObject(),
            someResult2: super.getRunSubResultObject(),
        }

        const someResult1: ITaskRunSubResult = {
            success: true,
        }

        const someResult2: ITaskRunSubResult = {
            success: false,
        }

        R.results = {
            someResult1,
            someResult2,
        }

        // FINISH
        await super.runAfter()

        // RETURN
        return R
    }

}

describe(__filename, async () => {

    it('run()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.run()
        expect(R.results.someResult1.success).to.equal(true)
        expect(R.results.someResult2.success).to.equal(false)

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
        expect(R).to.equal('@utils/dmTpl/task')

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

    it('getRunSubResultObject()', async () => {
        const RETURN_OBJECT = {
            error: undefined,
            msg: undefined,
            success: undefined,
            value: undefined,
        }

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.getRunSubResultObject()
        expect(RETURN_OBJECT).to.deep.equal(R)

    })

    it('getRunReturnObject()', async () => {
        const RETURN_OBJECT = {
            options: undefined,
            results: undefined,
            success: undefined,
            value: undefined,
        }

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.getRunReturnObject()
        expect(RETURN_OBJECT).to.deep.equal(R)

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
