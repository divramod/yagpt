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

    it.only('run()', async () => {

        // PREPARE TASK
        const TASK = new Task({ cwd: __dirname, logging: false })

        // RUN
        const R_TEST_TASK: IResultMultiple = await TASK.run({
            projectPath: __dirname,
        })

        // TEST
        expect(R_TEST_TASK.results.aIsFeatureBranch.value).to.equal(true)

    })

})
