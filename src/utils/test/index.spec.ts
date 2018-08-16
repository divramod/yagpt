// https://gitlab.com/divramod/dm-tpl/issues/7
import { describe, expect, it } from '@utils/mocha/index'
import { ITaskRunResult } from '@utils/task/index'
import { Task } from './'

// PREPARE
const TASK = new Task({ cwd: __dirname, logging: false })

// TESTSUITE
describe(TASK.getTaskPath(), async () => {

    it('run()', async () => {

        const R: ITaskRunResult = await TASK.run()
        expect(R.results.someResult1.success).to.equal(true)

    })

    it('userInputCleanup(): 1 line', async () => {

        console.log('some very very very very very very long input') // tslint:disable-line:no-console
        const R = await TASK.userInputCleanup(1)
        expect(R).to.equal(true)

    })

    it('userInputCleanup(): 3 lines', async () => {
        console.log('some very very very very very very long input') // tslint:disable-line:no-console
        console.log('some very very very very very very long input') // tslint:disable-line:no-console
        console.log('some very very very very very very long input') // tslint:disable-line:no-console
        const R = await TASK.userInputCleanup(3)
        expect(R).to.equal(true)

    })

})
