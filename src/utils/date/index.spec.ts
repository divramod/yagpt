// https://gitlab.com/divramod/dm-tpl/issues/7
import { ITaskRunResult } from '@utils/task/index'
import { expect } from 'chai'
import 'mocha'
import { Task } from './'

// PREPARE
const TASK = new Task({ cwd: __dirname, logging: false })

// TESTSUITE
describe.only(TASK.getTaskPath(), async () => {

    it('run()', async () => {

        const R: ITaskRunResult = await TASK.run()
        expect(R.results.someResult1.success).to.equal(false)

    })

})
