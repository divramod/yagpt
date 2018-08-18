// https://gitlab.com/divramod/dm-tpl/issues/7
import { ITaskRunResult } from '@utils/dmTpl/task'
import { describe, expect, it } from '@utils/nodejs/test'
import { Task } from './'

// TESTSUITE
describe(__filename, async () => {

    it('run()', async () => {

        // PREPARE TASK
        const TASK = new Task({ cwd: __dirname, logging: false })

        // RUN
        const R_TEST_TASK: ITaskRunResult = await TASK.run()

        // TEST
        expect(R_TEST_TASK.results.someResult1.success).to.equal(true)

    })

})
