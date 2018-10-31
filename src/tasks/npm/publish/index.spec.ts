import { UConfig } from '@utils/nodejs/config'
import { UGit } from '@utils/nodejs/git'
import { UNpm } from '@utils/nodejs/npm'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { TNpmPublish } from './'

const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

// TESTSUITE
describe('Task Npm.publish ' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UConfig.testing.path)
    })

    afterEach(async () => {
        RIMRAF.sync(UConfig.testing.path)
    })

    describe('checkIsRunnable()', async () => {
        it([
            'success:',
            'all conditions fulfilled',
        ].join(' '), async () => {
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
            const TASK = new TNpmPublish(UConfig.testing.path)
            const R = await TASK.checkIsRunnable()

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
            await UNpm.prepareNpmRepository()
            const TASK = new TNpmPublish(UConfig.testing.path)
            const R = await TASK.checkIsRunnable()
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

    describe('runTask()', async () => {

        it([
            '1. value=true',
        ].join(' '), async () => {
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
            const TASK = new TNpmPublish(UConfig.testing.path)
            const R = await TASK.runTask(true)
            expect(R.value).to.equal(true)
        }).timeout(60000)

        it([
            '2. value=false',
            'not all conditions fulfilled',
        ].join(' '), async () => {
            await UNpm.prepareNpmRepository()
            const TASK = new TNpmPublish(UConfig.testing.path)
            const R = await TASK.runTask()
            expect(R.value).to.equal(false)
        }).timeout(60000)

    })

})
