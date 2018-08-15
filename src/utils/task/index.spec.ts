// https://gitlab.com/divramod/dm-tpl/issues/7
import { expect } from 'chai'
import 'mocha'
import { SuperTask } from './'
import { ITaskClass, ITaskRunResult, ITaskRunSubResult, ITaskRunSubResults } from './index.d'

// TEST RETURN INTERFACE for Task.run()
export interface ITestTaskRunSubResults extends ITaskRunSubResults {
    someResult1: ITaskRunSubResult;
    someResult2: ITaskRunSubResult;
}

// TEST CLASS Task
class Task extends SuperTask implements ITaskClass {

    constructor(cwd: string = '', logging: boolean = false) {
        super({ name: 'Test', cwd, logging })
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

describe.only('@utils/task', async () => {

    it('should run a task', async () => {

        const TEST_TASK = new Task()
        const R_TEST_TASK = await TEST_TASK.run()

        expect(R_TEST_TASK.results.someResult1.success).to.equal(true)
        expect(R_TEST_TASK.results.someResult2.success).to.equal(false)

        // TEST
        expect(1).to.equal(1) // passes

    })

})
