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
import { IResult } from '@utils/nodejs/common'

// TESTSUITE
describe(__filename, async () => {

    beforeEach(async () => {
        // RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        // RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    it([
        'run()',
        'success:',
        'all conditions fulfilled',
    ].join(' '), async () => {

        // PREPARE TASK
        const TASK = new Task({ cwd: __dirname, logging: false })

        // PREPARE Repository
        // RIMRAF.sync(UTest.NPM_REPOSITORY.path) // REMOVE DIRECTORY
        await UTest.prepareNpmRepository()
        await UGit.removeAllBranchesExcept(UTest.NPM_REPOSITORY.path)
        await UGit.checkoutNewBranch(
            UTest.NPM_REPOSITORY.path,
            'feature/123-test-feature',
        )

        // RUN
        const R: IResult = await TASK.isRunnable({
            PROJECT_PATH: UTest.NPM_REPOSITORY.path,
        })

        // isGitRepository
        expect(R.subresults.isGitRepository.value).not.to.be.undefined
        expect(R.subresults.isGitRepository.value).to.equal(true)

        // checkIsFeatureBranch
        expect(R.subresults.isFeatureBranch.value).not.to.be.undefined
        expect(R.subresults.isFeatureBranch.value).to.equal(true)

        // isClean
        expect(R.subresults.isClean.value).not.to.be.undefined
        expect(R.subresults.isClean.value).to.equal(true)

        // isDevelopMergable
        expect(R.subresults.isDevelopMergable.value).not.to.be.undefined
        expect(R.subresults.isDevelopMergable.value).to.equal(true)

    }).timeout(60000)

})
