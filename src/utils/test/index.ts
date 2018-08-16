// https://gitlab.com/divramod/dm-tpl/issues/7

// IMPORT
const SHELL = require('shelljs')

// TYPINGS / SuperTask
import {
    ITaskClass,
    ITaskConstructorParams,
    ITaskRunResult,
    ITaskRunSubResult,
    ITaskRunSubResults,
    SuperTask,
} from '@utils/task/index'

// INTERFACE for Task.run()
interface ITestTaskRunSubResults extends ITaskRunSubResults {
    someResult1: ITaskRunSubResult;
}

// CLASS Task
export class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({ name: 'Test Helper', cwd: opts.cwd, logging: opts.logging || false })
    }

    public async run(): Promise<ITaskRunResult> {

        // SUPER runBefore()
        await super.runBefore()

        // PREPARE RESULTS
        const someResult1: ITaskRunSubResult = {
            success: true,
        }

        // RUN
        const R: ITaskRunResult = super.getRunReturnObject()
        const R_SUB: ITestTaskRunSubResults = {
            someResult1: super.getRunSubResultObject(),
        }

        // SET results
        R.results = {
            someResult1,
        }

        // SUPER runAfter()
        await super.runAfter()

        // RETURN
        return R
    }

    public async userInputCleanup(LINE_COUNT: number) {
        let userInputCleanupRun = false
        const CLEANUP_COMMAND = 'tput cuu1 && echo "                                                " && tput cuu1'
        for (let i = 0; i < LINE_COUNT; i++) {
            SHELL.exec(CLEANUP_COMMAND)
        }
        userInputCleanupRun = true
        return userInputCleanupRun
    }

}
