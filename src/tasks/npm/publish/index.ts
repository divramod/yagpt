// https://gitlab.com/divramod/dm-tpl/issues/7

// IMPORT
import { UCommon } from '@utils/nodejs/common'
import { UGit } from '@utils/nodejs/git'

// TYPINGS / SuperTask
import {
    ITaskClass,
    ITaskConstructorParams,
    SuperTask,
} from '@utils/dmTpl/task/index'
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// INTERFACE for Task.run()
interface INpmPublishTaskRunSubResults extends IResultMultiple {
    aIsFeatureBranch: IResultOne; // TODO
    bGetFeatureNameAndIssueNumber: IResultOne; // TODO
    cCommitChanges: IResultOne; // TODO
}

// CLASS Task
export class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({
            cwd: opts.cwd,
            logging: opts.logging || false,
            name: 'Npm Publish',
        })
    }

    public async run(): Promise<IResultMultiple> {

        // SUPER runBefore()
        await super.runBefore()

        // PREPARE RESULTS
        const someResult1: IResultOne = UCommon.getResultObjectAtomic()
        someResult1.success = true

        // Initialize Results
        const RESULT_MAIN: IResultMultiple = UCommon.getResultObjectMultiple()
        const RESULTS: INpmPublishTaskRunSubResults = UCommon.getResultsObject([
            'aIsFeatureBranch',
            'bGetFeatureNameAndIssueNumber',
            'cCommitChanges',
        ])

        // prepare Utilities
        UGit.init(__dirname)

        // SET results
        RESULT_MAIN.results = {
            someResult1,
        }

        // SUPER runAfter()
        await super.runAfter()

        // RETURN
        return RESULT_MAIN
    }

}
