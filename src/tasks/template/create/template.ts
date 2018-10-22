// IMPORT
import { UCommon } from '@utils/nodejs/common'

// REQUIRE

// TYPINGS / SuperTask
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'
import {
    ITaskClass,
    ITaskConstructorParams,
    SuperTask,
} from '@utils/nodejs/task/index'

// INTERFACE for Task.run()
interface ITaskRunSubResults extends IResults {
    someResult: IResultOne;
}

// CLASS Task
export class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({
            cwd: opts.cwd,
            logging: opts.logging || false,
            name: '???',
        })
    }

    public async test(OPTIONS: {
        SOME_PARAMETER: string,
    }): Promise < ITaskRunSubResults > {

        // DESTRUCT PRAMS
        const { SOME_PARAMETER } = OPTIONS

        const RE: ITaskRunSubResults = UCommon.getResultsObject([
            'someResult',
        ])

        const SOME_R = {
            value: true,
        }
        if (SOME_R.value) {
            RE.someResult.value = true
            RE.someResult.message = [
                '',
            ].join(' ')
        } else {
            RE.someResult.value = false
            RE.someResult.message = [
                '',
            ].join(' ')
        }

        return RE
    }

    public async run(OPTIONS: {
        SOME_PARAMETER: string,
    }): Promise < IResultMultiple > {

        // SUPER runBefore()
        await super.runBefore()

        // DESTRUCT PRAMS
        const { SOME_PARAMETER } = OPTIONS

        // Initialize Results
        const RM: IResultMultiple = UCommon.getResultObjectMultiple()
        const JOB_RESULTS: ITaskRunSubResults = UCommon.getResultsObject([
            'someResult',
        ])

        // PROOF IF PREREQUISITES ARE FULLFILLED
        RM.testResults = await this.test(OPTIONS)
        let proceed = true

        // RUN IF PREREQUISITES ARE FULLFILLED
        if (proceed) {
            if (true) {
                RM.success = JOB_RESULTS.someResult.value = proceed = true
                RM.message = JOB_RESULTS.someResult.message = [
                    '',
                ].join(' ')
            } else {
                RM.success = JOB_RESULTS.someResult.value = proceed = false
                RM.message = JOB_RESULTS.someResult.message = [
                    '',
                ].join(' ')
            }
        }

        // FINISH
        RM.jobResults = JOB_RESULTS

        // SUPER runAfter()
        await super.runAfter()

        // RETURN
        return RM
    }

}
