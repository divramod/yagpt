// https://gitlab.com/divramod/yagpt/issues/7
import { UConfig } from '@utils/nodejs/config'
import { UGit } from '@utils/nodejs/git'
import { UNpm } from '@utils/nodejs/npm'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { Task } from './'

// REQUIRE
const RIMRAF = require('rimraf')

// TESTSUITE
describe('Task Npm.publish ' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UConfig.testPath) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UConfig.testPath) // REMOVE DIRECTORY
    })

    describe('isRunnable()', async () => {
        it([
            'run()',
            'success:',
            'all conditions fulfilled',
        ].join(' '), async () => {
            const TASK = new Task({ cwd: __dirname, logging: false })
            await UNpm.prepareNpmRepository()
            await UGit.removeAllBranchesExcept(UConfig.testing.path)
            await UGit.checkoutNewBranch(
                UConfig.testing.path,
                'develop',
            )
            await UGit.checkoutNewBranch(
                UConfig.testing.path,
                'feature/123-test-feature',
            )
            const R = await TASK.isRunnable({
                PROJECT_PATH: UConfig.testing.path,
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

})
