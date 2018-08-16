// https://gitlab.com/divramod/dm-tpl/issues/7
import { expect } from 'chai'
import 'mocha'

import { SuperTask } from './'
import { ITaskClass, ITaskConstructorParams, ITaskRunResult, ITaskRunSubResult, ITaskRunSubResults } from './index.d'

// TEST RETURN INTERFACE for Task.run()
export interface ITestTaskRunSubResults extends ITaskRunSubResults {
    someResult1: ITaskRunSubResult;
    someResult2: ITaskRunSubResult;
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

const TEST_TASK = new Task({ cwd: __dirname, logging: false })
describe.only(TEST_TASK.getTaskPath(), async () => {

    it('run()', async () => {

        const R_TEST_TASK = await TEST_TASK.run()
        expect(R_TEST_TASK.results.someResult1.success).to.equal(true)
        expect(R_TEST_TASK.results.someResult2.success).to.equal(false)

    })

    it('getTaskPath()', async () => {

        const TASK_PATH = TEST_TASK.getTaskPath()
        expect(TASK_PATH).to.equal('@utils/task')

    })

    it('printName()', async () => {

        const R_PRINT_NAME = TEST_TASK.printName()
        expect(R_PRINT_NAME).to.equal(false)

    })

    it('runBefore()', async () => {

        const R_RUN_BEFORE = await TEST_TASK.runBefore()
        expect(R_RUN_BEFORE).to.equal(false)

    })

    it('runAfter()', async () => {

        const R = await TEST_TASK.runAfter()
        expect(R).to.equal(false)

    })

    it('getName()', async () => {

        const R = TEST_TASK.getName()
        expect(R).to.equal('Test')

    })

    it('logValue()', async () => {

        const R = TEST_TASK.logValue('', '')
        expect(R).to.equal(false)

    })

    it('logHeader()', async () => {

        const R = TEST_TASK.logHeader('', '')
        expect(R).to.equal(false)

    })

})
