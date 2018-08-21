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

    public async run(PARAMS: {
        projectPath: string,
    }): Promise<IResultMultiple> {

        // SUPER runBefore()
        await super.runBefore()

        // Initialize Results
        const RESULT_MAIN: IResultMultiple = UCommon.getResultObjectMultiple()
        const RESULTS: INpmPublishTaskRunSubResults = UCommon.getResultsObject([
            'aIsFeatureBranch',
            'bGetFeatureNameAndIssueNumber',
            'cCommitChanges',
        ])

        // aIsFeatureBranch
        const aIsFeatureBranch: IResultOne =
        await UGit.isFeatureBranch(PARAMS.projectPath)
        RESULT_MAIN.results.aIsFeatureBranch = aIsFeatureBranch

        if (aIsFeatureBranch.value) {
            // TODO
        } else {
            RESULT_MAIN.success = false
            RESULT_MAIN.message = 'Not in Feature Branch'
        }

        // SUPER runAfter()
        await super.runAfter()

        // RETURN
        return RESULT_MAIN
    }

}
