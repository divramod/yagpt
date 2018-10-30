import { UConfig } from '@utils/nodejs/config'
import { UGit } from '@utils/nodejs/git'
import { UNpm } from '@utils/nodejs/npm'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { NpmPublish } from './'

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
            'success:',
            'all conditions fulfilled',
        ].join(' '), async () => {
            const TASK = new NpmPublish()
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
            const R = await TASK.isRunnable(
                UConfig.testing.path,
            )

            expect(R.isGitRepository).not.to.be.undefined
            expect(R.isGitRepository).to.equal(true)
            expect(R.isFeatureBranch).not.to.be.undefined
            expect(R.isFeatureBranch).to.equal(true)
            expect(R.isClean).not.to.be.undefined
            expect(R.isClean).to.equal(true)
            expect(R.isDevelopMergable).not.to.be.undefined
            expect(R.isDevelopMergable).to.equal(true)

        }).timeout(60000)

        it([
            'error:',
            'not all conditions fulfilled',
        ].join(' '), async () => {
            const TASK = new NpmPublish()
            await UNpm.prepareNpmRepository()
            const R = await TASK.isRunnable(
                UConfig.testing.path,
            )
            expect(R.isFeatureBranch).not.to.be.undefined
            expect(R.isFeatureBranch).to.contain([
                'ERROR:',
                'Current Branch master in /tmp/test/yagpt',
                'is not a feature branch!',
                ].join(' '),
            )
            expect(R.value).to.equal(false)
        }).timeout(60000)
    })

    describe('run()', async () => {
        it([
            '1. value=true',
        ].join(' '), async () => {
            const TASK = new NpmPublish()
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
            const R = await TASK.run(
                UConfig.testing.path,
            )
            expect(R.value).to.equal(true)
        }).timeout(60000)

        it([
            '2. value=false',
            'not all conditions fulfilled',
        ].join(' '), async () => {
            const TASK = new NpmPublish()
            await UNpm.prepareNpmRepository()
            const R = await TASK.run(
                UConfig.testing.path,
            )
            expect(R.value).to.equal(false)
        }).timeout(60000)

    })

})
