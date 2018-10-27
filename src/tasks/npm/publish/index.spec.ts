// https://gitlab.com/divramod/yagpt/issues/7
import { UGit } from '@utils/nodejs/git'
import { UNpm } from '@utils/nodejs/npm'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { Task } from './'

// REQUIRE
const RIMRAF = require('rimraf')

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
        const TASK = new Task({ cwd: __dirname, logging: false })
        await UNpm.prepareNpmRepository()
        await UGit.removeAllBranchesExcept(UTest.npmPackage.path)
        await UGit.checkoutNewBranch(
            UTest.npmPackage.path,
            'feature/123-test-feature',
        )
        const R = await TASK.isRunnable({
            PROJECT_PATH: UTest.npmPackage.path,
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
