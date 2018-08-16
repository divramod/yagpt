// https://gitlab.com/divramod/dm-tpl/issues/7
import { describe, expect, it } from '@utils/mocha/index'

import { ITaskRunResult } from '@utils/task/index'
import { Task } from './'

// PREPARE
const TASK = new Task({ cwd: __dirname, logging: false })

// TESTSUITE
describe(TASK.getTaskPath(), async () => {

    it('should run a task', async () => {

        // RUN
        const R_TEST_TASK: ITaskRunResult = await TASK.run()

        // TEST
        expect(R_TEST_TASK.results.someResult1.success).to.equal(true)

    })

})
