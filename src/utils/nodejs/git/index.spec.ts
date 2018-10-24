// https://gitlab.com/divramod/yagpt/issues/4
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UGit as U_INSTANCE, UGitUtility as U_CLASS } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')
import { IResult } from '@utils/nodejs/common'

// TESTSUITE
describe.only('UGit: ' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        // RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    describe('class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe('branchExistant()', async () => {

        it([
            '1. (suc) boolean: true',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            const R: boolean | string =
                await U_INSTANCE.branchExistant(
                    UTest.TEST_PATH,
                    'master',
                )
            expect(R).to.equal(true)
        })

        it([
            '2. string "Error: Branch `branchName` not existant!"',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            const R: boolean | string =
                await U_INSTANCE.branchExistant(
                    UTest.TEST_PATH,
                    'someWeirdBranchName',
                )
            expect(R).to.equal([
                'Error:',
                'Branch',
                'someWeirdBranchName',
                'not existant!',
            ].join(' '))
        })

        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.branchExistant(
                '/some/weird/path',
                'test',
            )
            expect(R).to.equal([
                'Error:',
                '/some/weird/path',
                'not existant!',
            ].join(' '))
        })
    })

    describe('removeAllBranchesExcept()', async () => {

        it([
            '1. (suc) boolean: true',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            await U_INSTANCE.checkoutNewBranch(
                UTest.TEST_PATH,
                'feature/001-test',
            )
            await U_INSTANCE.checkoutBranch(
                UTest.TEST_PATH,
                'master',
            )
            const R: boolean | string =
                await U_INSTANCE.removeAllBranchesExcept(
                    UTest.TEST_PATH,
                )
            expect(R).to.equal(true)
        })

        it([
            '2. (err) string: "Error: `gitRepositoryPath` is not a git',
            'repository!',
        ].join(' '), async () => {
            await UTest.createTestDirectory(UTest.TEST_PATH)
            const R: boolean | string =
                await U_INSTANCE.removeAllBranchesExcept(
                    UTest.TEST_PATH,
                )
            expect(R).to.equal([
                'Error:',
                UTest.TEST_PATH,
                'is not a git repository!',
            ].join(' '))
        })
    })

    describe('getFeatureName()', async () => {

        it([
            'success:',
            'returns feature name',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            await U_INSTANCE.checkoutNewBranch(
                UTest.TEST_PATH,
                'feature/004-job-npm-publish',
            )
            const R = await U_INSTANCE.getFeatureName(UTest.TEST_PATH)
            expect(R).to.equal('job-npm-publish')
        })

        it([
            'failure:',
            'is not a feature branch',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            const R = await U_INSTANCE.getFeatureName(UTest.TEST_PATH)
            expect(R).to.equal([
                'Current Branch master in',
                UTest.TEST_PATH,
                'is not a feature branch!',
            ].join(' '))

        })

        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.getFeatureName(UTest.TEST_PATH)
            expect(R).to.equal([
                'Error:',
                UTest.TEST_PATH,
                'not existant!',
            ].join(' '))
        })
    })

    describe('getFeatureIssueNumber()', async () => {

        it([
            'success:',
            'returns issue number',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            await U_INSTANCE.checkoutNewBranch(
                UTest.TEST_PATH,
                'feature/004-job-npm-publish',
            )
            const R  =
                await U_INSTANCE.getFeatureIssueNumber(UTest.TEST_PATH)
            expect(R).to.equal(4)
        })

        it([
            'failure:',
            'is not a feature branch',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            const R = await U_INSTANCE.getFeatureIssueNumber(UTest.TEST_PATH)
            expect(R).to.equal([
                'Current Branch master in',
                UTest.TEST_PATH,
                'is not a feature branch!',
            ].join(' '))

        })

        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.getFeatureIssueNumber(UTest.TEST_PATH)
            expect(R).to.equal([
                'Error:',
                UTest.TEST_PATH,
                'not existant!',
            ].join(' '))
        })

    })

    describe('checkIsClean()', async () => {

        // checkIsClean
        it([
            'success:',
            'repo clean',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R = await U_INSTANCE.checkIsClean(UTest.TEST_PATH)

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
            SHELL.touch(PATH.resolve(UTest.TEST_PATH, 'test.md'))

            // RUN
            const R = await U_INSTANCE.checkIsClean(UTest.TEST_PATH)

            // TEST
            expect(R).to.equal([
                'Repository at',
                UTest.TEST_PATH,
                'not clean!',
            ].join(' '))
        })

        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkIsClean(UTest.TEST_PATH)
            expect(R).to.equal([
                'Error:',
                UTest.TEST_PATH,
                'not existant!',
            ].join(' '))
        })

    })

    describe('checkIsRepo()', async () => {

        it([
            '1. boolean(true):',
            'Directory at path holds git repository.',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R = await U_INSTANCE.checkIsRepo(UTest.TEST_PATH)

            // TEST
            expect(R).to.equal(true)
        })

        it([
            '2. string("Error: `directoryPath` is not a git repository!',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(UTest.TEST_PATH)

            // RUN
            const R = await U_INSTANCE.checkIsRepo(UTest.TEST_PATH)

            // TEST
            expect(R).to.equal([
                'Error:',
                UTest.TEST_PATH,
                'is not a git repository!',
            ].join(' '))
        })

        it([
            '3. string("Error: `directoryPath` not existant`!',
        ].join(' '), async () => {

            // RUN
            const R = await U_INSTANCE.checkIsRepo('/some/very/weird/path')

            // TEST
            expect(R).to.equal(
                'Error: /some/very/weird/path not existant!',
            )
        })

    })

    describe('getBranchName()', async () => {

        it([
            '1. string(BRANCH_NAME)',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            const R = await U_INSTANCE.getBranchName(UTest.TEST_PATH)
            expect(R).to.equal('master')
        })

        it([
            '2. string("Error: `gitRepositoryPath` is not a git repository!")',
        ].join(' '), async () => {
            await UTest.createTestDirectory(UTest.TEST_PATH)
            const R = await U_INSTANCE.getBranchName(UTest.TEST_PATH)
            expect(R).to.equal([
                'Error:',
                UTest.TEST_PATH,
                'is not a git repository!',
            ].join(' '))
        })

        it([
            '3. string("Error: `gitRepositoryPath` not existant!")',
        ].join(' '), async () => {
            const WEIRD_PATH = '/tmp/test/bla/bla'
            const R = await U_INSTANCE.getBranchName(WEIRD_PATH)
            expect(R).to.equal([
                'Error:',
                WEIRD_PATH,
                'not existant!',
            ].join(' '))
        })
    })

    describe('checkoutNewBranch()', async () => {

        it([
            '1 (suc) boolean true',
            'branch created and checked out',
        ].join(' '), async () => {

            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            const R = await U_INSTANCE.checkoutNewBranch(
                UTest.TEST_PATH,
                'feature/123',
            )
            expect(R).to.equal(true)
        })

        it([
            '2. branch existant',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            const R = await U_INSTANCE.checkoutNewBranch(
                UTest.TEST_PATH,
                'master',
            )
            expect(R).to.equal([
                'Error:',
                'Branch',
                'master',
                'already existant at',
                UTest.TEST_PATH,
                '!',
            ].join(' '))
        })

        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkoutNewBranch(
                '/some/weird/path',
                'test',
            )
            expect(R).to.equal([
                'Error:',
                '/some/weird/path',
                'not existant!',
            ].join(' '))
        })

    })

    describe('checkoutBranch()', async () => {

        it([
            '1 (suc) boolean true',
            'branch existant and checked out',
        ].join(' '), async () => {

            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            await U_INSTANCE.checkoutNewBranch(
                UTest.TEST_PATH,
                'feature/123',
            )
            const R = await U_INSTANCE.checkoutBranch(
                UTest.TEST_PATH,
                'master',
            )
            expect(R).to.equal(true)
        })

        it([
            '2. branch not existant',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            const R = await U_INSTANCE.checkoutBranch(
                UTest.TEST_PATH,
                'someWeirdBranchName',
            )
            expect(R).to.equal([
                'Error:',
                'Branch',
                'someWeirdBranchName',
                'not existant at',
                UTest.TEST_PATH,
                '!',
            ].join(' '))
        })

        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkoutBranch(
                '/some/weird/path',
                'test',
            )
            expect(R).to.equal([
                'Error:',
                '/some/weird/path',
                'not existant!',
            ].join(' '))
        })

    })

    describe('checkIsFeatureBranch()', async () => {
        it([
            '1. boolean(true)',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            await U_INSTANCE.checkoutNewBranch(
                UTest.TEST_PATH,
                'feature/123-test',
            )
            const R = await U_INSTANCE.checkIsFeatureBranch(UTest.TEST_PATH)
            expect(R).to.equal(true)
        })
        it([
            '2. string "Error: Current branch is not a feature branch!"',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            const R = await U_INSTANCE.checkIsFeatureBranch(UTest.TEST_PATH)
            expect(R).to.equal([
                'Current Branch master in',
                UTest.TEST_PATH,
                'is not a feature branch!',
            ].join(' '))
        })
        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkIsFeatureBranch(UTest.TEST_PATH)
            expect(R).to.equal([
                'Error:',
                UTest.TEST_PATH,
                'not existant!',
            ].join(' '))
        })
    })

    describe.only('checkIsMergable()', async () => {

        it([
            '1. boolean(true)',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            await U_INSTANCE.checkoutNewBranch(
                UTest.TEST_PATH,
                'feature/123-test',
            )
            const R = await U_INSTANCE.checkIsFeatureBranch(UTest.TEST_PATH)
            expect(R).to.equal(true)
        })

        // it([
            // '2. string "Error: Current branch is not a feature branch!"',
        // ].join(' '), async () => {
            // await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            // const R = await U_INSTANCE.checkIsFeatureBranch(UTest.TEST_PATH)
            // expect(R).to.equal([
                // 'Current Branch master in',
                // UTest.TEST_PATH,
                // 'is not a feature branch!',
            // ].join(' '))
        // })

        // it([
            // '3. string "Error: not existant!',
        // ].join(' '), async () => {
            // const R = await U_INSTANCE.checkIsFeatureBranch(UTest.TEST_PATH)
            // expect(R).to.equal([
                // 'Error:',
                // UTest.TEST_PATH,
                // 'not existant!',
            // ].join(' '))
        // })

    })
})
