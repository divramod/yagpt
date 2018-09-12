// https://gitlab.com/divramod/dm-tpl/issues/

// IMPORT

// TYPINGS / SuperTask
import {
    ITaskClass,
    ITaskConstructorParams,
    SuperTask,
} from '@utils/nodejs/task'

// INTERFACE for Task.run()
interface IApiCreateTaskRunSubResults extends ITaskRunSubResults {
    someResult1: ITaskRunSubResult;
}

// CLASS Task
export class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({ name: 'ApiCreate', cwd: opts.cwd, logging: opts.logging || false })
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
        const R_SUB: IApiCreateTaskRunSubResults = {
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
