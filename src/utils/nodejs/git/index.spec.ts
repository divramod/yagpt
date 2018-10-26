// https://gitlab.com/divramod/yagpt/issues/4
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UGit as U_INSTANCE, UGitUtility as U_CLASS } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')
import { IResult } from '@utils/nodejs/common'

// TESTSUITE
describe('UGit: ' + __filename, async () => {

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
            await U_INSTANCE.checkoutNewBranch(
                UTest.TEST_PATH,
                'remotes/test',
            )
            await U_INSTANCE.checkoutBranch(
                UTest.TEST_PATH,
                'master',
            )
            const R: boolean | string =
                await U_INSTANCE.removeAllBranchesExcept(
                    UTest.TEST_PATH,
                    [
                        'master',
                        'develop',
                    ],
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

    describe('checkIsMergableFromTo()', async () => {

        it([
            '1. boolean true: clean',
        ].join(' '), async () => {
            const README_PATH = PATH.resolve(UTest.TEST_PATH, 'README.md')
            const gitRepositoryPath = PATH.resolve(UTest.TEST_PATH)
            const rGitCreateTestRepo =
                await UTest.gitCreateTestRepositoryAtPath(gitRepositoryPath)
            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'develop',
            )
            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'feature/001-test1',
            )
            SHELL.ShellString(
                '\nLine 6 from feature/001-test1',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'README.md (#001-test1)',
                ['README.md'],
            )
            const rCheckIsMergableFromTo =
                await U_INSTANCE.checkIsMergableFromTo(
                    gitRepositoryPath,
                    'develop',
                )
            // const rRmDirectory = SHELL.rm(
                // '-rf',
                // PATH.resolve('/home/mod/me-test/hello'),
            // )
            // const rCopyDirectory = SHELL.cp(
                // '-rf',
                // PATH.resolve(gitRepositoryPath),
                // PATH.resolve('/home/mod/me-test/hello'),
            // )
            expect(rCheckIsMergableFromTo).to.equal(true)
        })

        it([
            '2. boolean true: unclean',
        ].join(' '), async () => {
            const README_PATH = PATH.resolve(UTest.TEST_PATH, 'README.md')
            const gitRepositoryPath = PATH.resolve(UTest.TEST_PATH)
            const rGitCreateTestRepo =
                await UTest.gitCreateTestRepositoryAtPath(gitRepositoryPath)
            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'develop',
            )
            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'feature/001-test1',
            )
            SHELL.ShellString(
                '\nLine 6 from feature/001-test1',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'README.md (#001-test1)',
                ['README.md'],
            )
            await U_INSTANCE.checkoutBranch(
                gitRepositoryPath,
                'develop',
            )
            SHELL.ShellString(
                '\nLine 7 from develop',
            ).toEnd(README_PATH)
            const rCheckIsMergableFromTo =
                await U_INSTANCE.checkIsMergableFromTo(
                    gitRepositoryPath,
                    'develop',
                    'feature/001-test1',
                )
            expect(rCheckIsMergableFromTo).to.equal(true)
        })

        it([
            '3. string: ERROR: merge conflic',
        ].join(' '), async () => {
            const README_PATH = PATH.resolve(UTest.TEST_PATH, 'README.md')
            const gitRepositoryPath = PATH.resolve(UTest.TEST_PATH)
            const rGitCreateTestRepo =
                await UTest.gitCreateTestRepositoryAtPath(gitRepositoryPath)
            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'develop',
            )
            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'feature/001-test1',
            )
            SHELL.ShellString(
                '\nLine 6 from feature/001-test1',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'README.md (#001-test1)',
                ['README.md'],
            )
            await U_INSTANCE.checkoutBranch(
                gitRepositoryPath,
                'develop',
            )
            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'feature/002-test2',
            )
            SHELL.ShellString(
                '\nLine 6 from feature/002-test2',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'README.md (#002-test2)',
                ['README.md'],
            )
            await U_INSTANCE.checkoutBranch(
                gitRepositoryPath,
                'develop',
            )
            await U_INSTANCE.mergeFromTo(
                gitRepositoryPath,
                'feature/001-test1',
                'develop',
            )
            const rCheckIsMergableFromTo =
                await U_INSTANCE.checkIsMergableFromTo(
                    gitRepositoryPath,
                    'develop',
                    'feature/002-test2',
                )
            expect(rCheckIsMergableFromTo).to.not.equal(true)
        })

    }).timeout(10000)

    describe('commit()', async () => {
        it([
            '1. boolean(true) commitMessage default, filesToCommitTo default',
        ].join(' '), async () => {
            const gitRepositoryPath = PATH.resolve(UTest.TEST_PATH)
            const README_PATH = PATH.resolve(gitRepositoryPath, 'README.md')
            await UTest.gitCreateTestRepositoryAtPath(gitRepositoryPath)
            SHELL.ShellString(
                '\nLine 6 from feature/001-test1',
            ).toEnd(README_PATH)
            const R = await U_INSTANCE.commit(gitRepositoryPath)
            expect(R).to.equal(true)
        })
        it([
            '2. boolean(true)',
        ].join(' '), async () => {
            const gitRepositoryPath = PATH.resolve(UTest.TEST_PATH)
            const README_PATH = PATH.resolve(gitRepositoryPath, 'README.md')
            await UTest.gitCreateTestRepositoryAtPath(gitRepositoryPath)
            SHELL.ShellString(
                '\nLine 6 from feature/001-test1',
            ).toEnd(README_PATH)
            const R = await U_INSTANCE.commit(
                gitRepositoryPath,
                'update',
                ['README.md'],
            )
            expect(R).to.equal(true)
        })
    })

    describe('mergeFromTo()', async () => {
        it([
            '1. boolean(true): nothing to stash',
        ].join(' '), async () => {
            const gitRepositoryPath = PATH.resolve(UTest.TEST_PATH)
            const README_PATH = PATH.resolve(gitRepositoryPath, 'README.md')
            await UTest.gitCreateTestRepositoryAtPath(gitRepositoryPath)

            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'feature/002',
            )
            SHELL.ShellString(
                '\nLine 6 from feature/002-test2',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'feature/002',
                ['README.md'],
            )
            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'develop',
            )
            SHELL.ShellString(
                '\nLine 7 from develop',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'develop',
                ['README.md'],
            )
            const R = await U_INSTANCE.mergeFromTo(
                gitRepositoryPath,
                'develop',
                'feature/002',
                [],
            )
            const rRmDirectory = SHELL.rm(
                '-rf',
                PATH.resolve('/home/mod/me-test/hello'),
            )
            const rCopyDirectory = SHELL.cp(
                '-rf',
                PATH.resolve(gitRepositoryPath),
                PATH.resolve('/home/mod/me-test/hello'),
            )
            expect(R).to.have.string('SUCCESS')
        })

        it([
            '2. boolean(true): something to stash',
        ].join(' '), async () => {
            const gitRepositoryPath = PATH.resolve(UTest.TEST_PATH)
            const README_PATH = PATH.resolve(gitRepositoryPath, 'README.md')
            await UTest.gitCreateTestRepositoryAtPath(gitRepositoryPath)

            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'feature/002',
            )
            SHELL.ShellString(
                '\nLine 6 from feature/002-test2',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'feature/002',
                ['README.md'],
            )
            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'develop',
            )
            SHELL.ShellString(
                '\nLine 7 from develop',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'develop',
                ['README.md'],
            )
            SHELL.ShellString(
                '\nLine 8 from develop for testing stash',
            ).toEnd(README_PATH)
            const R = await U_INSTANCE.mergeFromTo(
                gitRepositoryPath,
                'develop',
                'feature/002',
            )
            const rRmDirectory = SHELL.rm(
                '-rf',
                PATH.resolve('/home/mod/me-test/hello'),
            )
            const rCopyDirectory = SHELL.cp(
                '-rf',
                PATH.resolve(gitRepositoryPath),
                PATH.resolve('/home/mod/me-test/hello'),
            )
            expect(R).to.have.string('SUCCESS')
        })

        it([
            '3. string ERROR: merge conflicts',
        ].join(' '), async () => {
            const gitRepositoryPath = PATH.resolve(UTest.TEST_PATH)
            const README_PATH = PATH.resolve(gitRepositoryPath, 'README.md')
            await UTest.gitCreateTestRepositoryAtPath(gitRepositoryPath)

            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'feature/002',
            )
            SHELL.ShellString(
                '\nLine 6 from feature/002-test2',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'feature/002',
                ['README.md'],
            )
            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'develop',
            )
            SHELL.ShellString(
                '\nLine 7 from develop',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'develop',
                ['README.md'],
            )

            await U_INSTANCE.checkoutBranch(
                gitRepositoryPath,
                'feature/002',
            )
            SHELL.ShellString(
                '\nLine 7 from feature/002-test2',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'feature/002',
                ['README.md'],
            )

            const R = await U_INSTANCE.mergeFromTo(
                gitRepositoryPath,
                'develop',
                'feature/002',
            )
            const rRmDirectory = SHELL.rm(
                '-rf',
                PATH.resolve('/home/mod/me-test/hello'),
            )
            const rCopyDirectory = SHELL.cp(
                '-rf',
                PATH.resolve(gitRepositoryPath),
                PATH.resolve('/home/mod/me-test/hello'),
            )

            expect(R).to.have.string('ERROR')
        })
    })

    describe('stash()', async () => {
        it([
            '1. boolean(true): when repository dirty and changes stashed',
        ].join(' '), async () => {
            const gitRepositoryPath = PATH.resolve(UTest.TEST_PATH)
            const README_PATH = PATH.resolve(gitRepositoryPath, 'README.md')
            await UTest.gitCreateTestRepositoryAtPath(gitRepositoryPath)

            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'feature/002',
            )
            SHELL.ShellString(
                '\nLine 6 from feature/002-test2',
            ).toEnd(README_PATH)
            const R = await U_INSTANCE.stash(
                gitRepositoryPath,
            )
            expect(R).to.equal(true)
        })

        it([
            '2. string ERROR: repository clean when repository clean',
        ].join(' '), async () => {
            const gitRepositoryPath = PATH.resolve(UTest.TEST_PATH)
            const README_PATH = PATH.resolve(gitRepositoryPath, 'README.md')
            await UTest.gitCreateTestRepositoryAtPath(gitRepositoryPath)

            await U_INSTANCE.checkoutNewBranch(
                gitRepositoryPath,
                'feature/002',
            )
            SHELL.ShellString(
                '\nLine 6 from feature/002-test2',
            ).toEnd(README_PATH)
            await U_INSTANCE.commit(
                gitRepositoryPath,
                'feature/002',
                ['README.md'],
            )
            const R = await U_INSTANCE.stash(
                gitRepositoryPath,
            )
            expect(R).to.have.string('ERROR: repository clean')
        })

    })

})
