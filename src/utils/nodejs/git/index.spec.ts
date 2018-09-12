// https://gitlab.com/divramod/yagpt/issues/4
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UGit as U_INSTANCE, UGitUtility as U_CLASS } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// TESTSUITE
describe(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    describe('UGit.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe('UGit.getFeatureName()', async () => {

        it([
            'failure:',
            'is not a git repository',
        ].join(' '), async () => {

            // PREPARE
            // await UTest.createTestDirectory(UTest.TEST_PATH)

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureName(UTest.TEST_PATH)

            // TEST
            expect(R.success).to.equal(false)
            expect(R.value).to.equal(undefined)
            expect(R.message).to.equal([
                UTest.TEST_PATH,
                'is not a git repository!',
            ].join(' '))

        })

        it([
            'failure:',
            'is not a feature branch',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureName(UTest.TEST_PATH)

            // TEST
            expect(R.success).to.equal(false)
            expect(R.value).to.equal(undefined)
            expect(R.message).to.equal([
                UTest.TEST_PATH,
                'is not on a feature Branch!',
            ].join(' '))

        })

        it([
            'success:',
            'returns issue number',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            await U_INSTANCE.checkoutBranch(
                UTest.TEST_PATH,
                'feature/004-job-npm-publish',
            )

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureName(UTest.TEST_PATH)

            // TEST
            expect(R.success).to.equal(true)
            expect(R.value).to.equal('job-npm-publish')
            expect(R.message).to.equal([
                UTest.TEST_PATH,
                'branch name is',
                'job-npm-publish',
            ].join(' '))

        })
    })

    describe('UGit.getFeatureIssueNumber()', async () => {

        it([
            'failure:',
            'is not a git repository',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(UTest.TEST_PATH)

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureIssueNumber(UTest.TEST_PATH)

            // TEST
            expect(R.success).to.equal(false)
            expect(R.value).to.equal(undefined)
            expect(R.message).to.equal([
                UTest.TEST_PATH,
                'is not a git repository!',
            ].join(' '))

        })

        it([
            'failure:',
            'is not a feature branch',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureIssueNumber(UTest.TEST_PATH)

            // TEST
            expect(R.success).to.equal(false)
            expect(R.value).to.equal(undefined)
            expect(R.message).to.equal([
                UTest.TEST_PATH,
                'is not on a feature Branch!',
            ].join(' '))

        })

        it([
            'success:',
            'returns issue number',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            await U_INSTANCE.checkoutBranch(
                UTest.TEST_PATH,
                'feature/004-job-npm-publish',
            )

            // RUN
            const R: IResultMultiple =
                await U_INSTANCE.getFeatureIssueNumber(UTest.TEST_PATH)

            // TEST
            expect(R.success).to.equal(true)
            expect(R.value).to.equal(4)
            expect(R.message).to.equal([
                UTest.TEST_PATH,
                'issue number is',
                4,
            ].join(' '))

        })

    })

    describe('UGit.checkIsClean()', async () => {

        // checkIsClean
        it([
            'success:',
            'repo clean',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R: boolean = await U_INSTANCE.checkIsClean(UTest.TEST_PATH)

            // TEST
            expect(R).to.equal(true)
        })

        // checkIsClean
        it([
            'failure:',
            'repo not clean',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            SHELL.touch(PATH.resolve(UTest.TEST_PATH, 'README.md'))

            // RUN
            const R: boolean = await U_INSTANCE.checkIsClean(UTest.TEST_PATH)

            // TEST
            expect(R).to.equal(false)
        })

    })

    describe('UGit.checkIsRepo()', async () => {

        it([
            'failure:',
            'repo not existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(UTest.TEST_PATH)

            // RUN
            const R: IResultOne = await U_INSTANCE.checkIsRepo(UTest.TEST_PATH)

            // TEST
            expect(R.value).to.equal(false)
        })

        it([
            'success:',
            'repo existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R: IResultOne = await U_INSTANCE.checkIsRepo(UTest.TEST_PATH)

            // TEST
            expect(R.value).to.equal(true)
        })

    })

    describe('UGit.getBranchName()', async () => {

        it([
            'success:',
            'repo existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R = await U_INSTANCE.getBranchName(UTest.TEST_PATH)

            // TEST
            expect(R).to.equal('master')
        })

        it([
            'success:',
            'repo not existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(UTest.TEST_PATH)

            // RUN
            const R = await U_INSTANCE.getBranchName(UTest.TEST_PATH)

            // TEST
            expect(R).to.equal(undefined)
        })

    })

    describe('UGit.checkoutBranch()', async () => {

        it([
            'success:',
            'repo existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R: boolean =
                await U_INSTANCE.checkoutBranch(
                    UTest.TEST_PATH,
                    'feature/123',
                )

            // TEST
            expect(R).to.equal(true)
        })

        it([
            'failure:',
            'repo not existant',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(UTest.TEST_PATH)

            // RUN
            const R: boolean =
                await U_INSTANCE.checkoutBranch(
                    UTest.TEST_PATH,
                    'feature/123',
                )

            // TEST
            expect(R).to.equal(false)

        })

    })

    describe('UGit.checkIsFeatureBranch()', async () => {

        it([
            'failure:',
            'repo not existant',
        ].join(' '), async () => {
            // PREPARE
            await UTest.createTestDirectory(UTest.TEST_PATH)

            // RUN
            const R = await U_INSTANCE.checkIsFeatureBranch(UTest.TEST_PATH)

            // TEST
            expect(R.value).to.equal(false)
        })

        it([
            'failure:',
            'not a feature branch',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R = await U_INSTANCE.checkIsFeatureBranch(UTest.TEST_PATH)

            // TEST
            expect(R.value).to.equal(false)
            expect(R.message).to.equal('Is not a Feature Branch')
        })

        it([
            'success:',
            'repo existant, feature checked out',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            await U_INSTANCE.checkoutBranch(UTest.TEST_PATH, 'feature/123')

            // RUN
            const R = await U_INSTANCE.checkIsFeatureBranch(UTest.TEST_PATH)

            // TEST
            expect(R.value).to.equal(true)
        })

    })

    describe.skip('UGit.gitPushOriginHead()', async () => {

        it([
            'success:',
            '',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R = await U_INSTANCE.pushOriginHead(UTest.TEST_PATH)

            // TEST
            expect(0).to.equal(1) // fails

        })

    })

})
