// https://gitlab.com/divramod/dm-tpl/issues/7

// IMPORT

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
interface IDateTaskRunSubResults extends ITaskRunSubResults {
    someResult1: ITaskRunSubResult;
}

// CLASS Task
export class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({ name: 'Date', cwd: opts.cwd, logging: opts.logging || false })
    }

    // TODO
    public async run(): Promise<ITaskRunResult> {

        // SUPER runBefore()
        await super.runBefore()

        // PREPARE RESULTS
        const someResult1: ITaskRunSubResult = {
            success: true,
        }

        // RUN
        const R: ITaskRunResult = super.getRunReturnObject()
        const R_SUB: IDateTaskRunSubResults = {
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

}
