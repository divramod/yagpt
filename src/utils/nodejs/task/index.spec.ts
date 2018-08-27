// https://gitlab.com/divramod/yagpt/issues/7
import {
    IResultMultiple,
    IResultOne,
    IResults,
    UCommon,
} from '@utils/nodejs/common'
import { UGit } from '@utils/nodejs/git'
import { describe, expect, it, TEST_PATH, UTest } from '@utils/nodejs/test'
import { ITaskClass, ITaskConstructorParams, SuperTask } from './'

// REQUIRE
const RIMRAF = require('rimraf')
const _ = require('underscore')

// TEST CLASS Task
class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({ name: 'Test', cwd: opts.cwd, logging: opts.logging || false })
    }

    public async run(): Promise<IResultMultiple> {
        // PREPARE
        await super.runBefore()

        // RUN
        const RESULT_MAIN: IResultMultiple = UCommon.getResultObjectMultiple()
        const RESULTS: IResults = UCommon.getResultsObject([
            'someResult1',
            'someResult2',
        ])
        RESULT_MAIN.results = RESULTS

        // PRODUCE SUB RESULT
        const someResult1: IResultOne = UCommon.getResultObjectOne()
        someResult1.success = true
        RESULT_MAIN.results.someResult1 = someResult1

        // PRODUCE SUB RESULT
        const someResult2: IResultOne = UCommon.getResultObjectOne()
        someResult2.success = false
        RESULT_MAIN.results.someResult2 = someResult2

        // PRODUCE RESULT
        RESULT_MAIN.success = true
        RESULT_MAIN.message = 'message'

        // FINISH
        await super.runAfter()

        // RETURN
        return RESULT_MAIN
    }

    /**
     *  - should solve potentially not solved prerequisites for a task
     *  - should always have the options automatically and manual
     */
    public async solvePrerequisites(
        TEST_PREREQUISITES_RESULT,
        SOLVE_WITH,
    ): Promise<any> {
        const RESULT = {
            isGitRepository: undefined,
        }

        //
        _.each(TEST_PREREQUISITES_RESULT, async (value, key, obj) => {
            console.log( // tslint:disable-line:no-console
                'obj[key]',
                obj[key],
            )
            RESULT[key] = await obj[key].resolver(SOLVE_WITH[key])
        })

        return RESULT
    }

    /**
     *  - is doing the tests, which define if a task can run
     */
    public async testPrerequisites(REPOSITORY_PATH): Promise<any> {
        // create TEST_RESULT
        const TEST_RESULT: any = {
            isGitRepository: undefined,
        }

        // run prerequisite test
        const R_IS_GIT_REPOSITORY = await UGit.checkIsRepo(REPOSITORY_PATH)
        TEST_RESULT.isGitRepository = {
            message: R_IS_GIT_REPOSITORY.message,
            resolver: async (OPTS) => {
                console.log( // tslint:disable-line:no-console
                    'in resolver',
                    OPTS,
                )
                if (OPTS.mode === 'automatic') {
                    // await UTest.gitCreateTestRepositoryAtPath(OPTS.path)
                }

                // create repo
                return true
            },
            value: R_IS_GIT_REPOSITORY.value,
        }

        // return result
        return TEST_RESULT
    }

}

describe(__filename, async () => {

    beforeEach(async () => {
        await RIMRAF.sync(TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        await RIMRAF.sync(TEST_PATH) // REMOVE DIRECTORY
    })

    describe.only('testPrerequisites()', async () => {

        it('allTrue', async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(TEST_PATH)

            // RUN
            const T = new Task({ cwd: __dirname, logging: false })
            const R = await T.testPrerequisites(TEST_PATH)

            // TEST
            expect(R.isGitRepository.value).to.equal(true) // fails

            // PRINT
            const SOLVE_WITH = {
                isGitRepository: {
                    mode: 'automatic',
                    path: TEST_PATH,
                },
            }
            const RESULT_SOLVER = await T.solvePrerequisites(R, SOLVE_WITH)

            // TEST
            expect(RESULT_SOLVER.isGitRepository).to.equal(true)

        })

    })

    it('run()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.run()
        expect(R.results.someResult1.success).to.equal(true)
        expect(R.results.someResult2.success).to.equal(false)

    })

    it('constructor()', async () => {

        const T = new Task({ cwd: __dirname})
        expect(T).to.deep.equal(T)

    })

    it('printName()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.printName()
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = T1.printName()
        expect(R1).to.equal(true)

    })

    it('getTaskPath()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.getTaskPath()
        expect(R).to.equal('@utils/nodejs/task')

    })

    it('getName()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.getName()
        expect(R).to.equal('Test')

    })

    it('async runBefore()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.runBefore()
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = await T1.runBefore()
        expect(R1).to.equal(true)
    })

    it('async runAfter()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = await T.runAfter()
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = await T1.runAfter()
        expect(R1).to.equal(true)

    })

    it('logValue()', async () => {

        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.logValue('', '')
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = T1.logValue('', '')
        expect(R1).to.equal(true)
    })

    it('logHeader()', async () => {
        const T = new Task({ cwd: __dirname, logging: false })
        const R = T.logHeader('', '')
        expect(R).to.equal(false)

        const T1 = new Task({ cwd: __dirname, logging: true })
        const R1 = T1.logHeader('', '')
        expect(R1).to.equal(true)
    })

})
