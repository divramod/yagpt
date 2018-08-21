// https://gitlab.com/divramod/dm-tpl/issues/7
import { UGit } from '@utils/nodejs/git'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { Task } from './'

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// TESTSUITE
describe(__filename, async () => {

    it('run()', async () => {

        // PREPARE TASK
        const TASK = new Task({ cwd: __dirname, logging: false })

        // RUN
        const R_TEST_TASK: IResultMultiple = await TASK.run()

        // TEST
        expect(R_TEST_TASK.results.someResult1.success).to.equal(true)

    })

    it('git()', async () => {

        const R = UGit.init(__dirname)
        expect(R).to.equal('')

    })

})
