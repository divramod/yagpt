// https://gitlab.com/divramod/yagpt/issues/7
import { UGit } from '@utils/nodejs/git'
import {
    describe,
    expect,
    it,
    UTest,
} from '@utils/nodejs/test'
import { Task } from './'

// REQUIRE
const RIMRAF = require('rimraf')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// TESTSUITE
describe.skip(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    it.skip([
        'run()',
        'success:',
        'all conditions fulfilled',
    ].join(' '), async () => {

        // PREPARE TASK
        const TASK = new Task({ cwd: __dirname, logging: false })

        // PREPARE Repository
        // RIMRAF.sync(UTest.NPM_REPOSITORY.path) // REMOVE DIRECTORY
        await UTest.prepareNpmRepository()
        await UGit.removeAllBranchesExceptMaster(UTest.NPM_REPOSITORY.path)
        await UGit.checkoutBranch(
            UTest.NPM_REPOSITORY.path,
            'feature/123-test-feature',
        )

        // RUN
        const R: IResultMultiple = await TASK.run({
            projectPath: UTest.NPM_REPOSITORY.path,
        })

        // isGitRepository
        expect(R.results.isGitRepository.value).not.to.be.undefined
        expect(R.results.isGitRepository.value).to.equal(true)

        // checkIsFeatureBranch
        const R_IS_FEATURE_BRANCH =
            await UGit.checkIsFeatureBranch(UTest.NPM_REPOSITORY.path)
        expect(R.results.isFeatureBranch.value).not.to.be.undefined
        expect(R.results.isFeatureBranch.value).to.equal(true)

        // isClean
        expect(R.results.isClean.value).not.to.be.undefined
        expect(R.results.isClean.value).to.equal(true)

        // isDevelopMergable
        expect(R.results.isDevelopMergable.value).not.to.be.undefined
        expect(R.results.isDevelopMergable.value).to.equal(true)

    }).timeout(60000)

})
