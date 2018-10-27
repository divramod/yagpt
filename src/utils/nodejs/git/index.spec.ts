import { UConfig } from '@utils/nodejs/config'
import { UNpm } from '@utils/nodejs/npm'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UGit as U_INSTANCE, UGitUtility as U_CLASS } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

// TESTSUITE
describe('yaGit: ' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UConfig.testPath) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UConfig.testPath) // REMOVE DIRECTORY
    })

    describe('branchExistant()', async () => {

        it([
            '1. (suc) boolean: true',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            const R: boolean | string =
                await U_INSTANCE.branchExistant(
                    UTest.testPath,
                    'master',
                )
            expect(R).to.equal(true)
        })

        it([
            '2. string "Error: Branch `branchName` not existant!"',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            const R: boolean | string =
                await U_INSTANCE.branchExistant(
                    UTest.testPath,
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
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            await U_INSTANCE.checkoutNewBranch(
                UTest.testPath,
                'feature/001-test',
            )
            await U_INSTANCE.checkoutNewBranch(
                UTest.testPath,
                'remotes/test',
            )
            await U_INSTANCE.checkoutBranch(
                UTest.testPath,
                'master',
            )
            const R: boolean | string =
                await U_INSTANCE.removeAllBranchesExcept(
                    UTest.testPath,
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
            await UTest.createTestDirectory(UTest.testPath)
            const R: boolean | string =
                await U_INSTANCE.removeAllBranchesExcept(
                    UTest.testPath,
                )
            expect(R).to.equal([
                'Error:',
                UTest.testPath,
                'is not a git repository!',
            ].join(' '))
        })
    })

    describe('getFeatureName()', async () => {

        it([
            'success:',
            'returns feature name',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            await U_INSTANCE.checkoutNewBranch(
                UTest.testPath,
                'feature/004-job-npm-publish',
            )
            const R = await U_INSTANCE.getFeatureName(UTest.testPath)
            expect(R).to.equal('job-npm-publish')
        })

        it([
            'failure:',
            'is not a feature branch',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            const R = await U_INSTANCE.getFeatureName(UTest.testPath)
            expect(R).to.equal([
                'Current Branch master in',
                UTest.testPath,
                'is not a feature branch!',
            ].join(' '))

        })

        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.getFeatureName(UTest.testPath)
            expect(R).to.equal([
                'Error:',
                UTest.testPath,
                'not existant!',
            ].join(' '))
        })
    })

    describe('getFeatureIssueNumber()', async () => {

        it([
            'success:',
            'returns issue number',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            await U_INSTANCE.checkoutNewBranch(
                UTest.testPath,
                'feature/004-job-npm-publish',
            )
            const R  =
                await U_INSTANCE.getFeatureIssueNumber(UTest.testPath)
            expect(R).to.equal(4)
        })

        it([
            'failure:',
            'is not a feature branch',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            const R = await U_INSTANCE.getFeatureIssueNumber(UTest.testPath)
            expect(R).to.equal([
                'Current Branch master in',
                UTest.testPath,
                'is not a feature branch!',
            ].join(' '))

        })

        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.getFeatureIssueNumber(UTest.testPath)
            expect(R).to.equal([
                'Error:',
                UTest.testPath,
                'not existant!',
            ].join(' '))
        })

    })

    describe('checkIsClean()', async () => {
        it([
            'success:',
            'repo clean',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            const R = await U_INSTANCE.checkIsClean(UTest.testPath)
            expect(R).to.equal(true)
        })

        // checkIsClean
        it([
            'failure:',
            'repo not clean',
        ].join(' '), async () => {

            // PREPARE
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            SHELL.touch(PATH.resolve(UTest.testPath, 'test.md'))

            // RUN
            const R = await U_INSTANCE.checkIsClean(UTest.testPath)

            // TEST
            expect(R).to.equal([
                'Repository at',
                UTest.testPath,
                'not clean!',
            ].join(' '))
        })

        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkIsClean(UTest.testPath)
            expect(R).to.equal([
                'Error:',
                UTest.testPath,
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
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)

            // RUN
            const R = await U_INSTANCE.checkIsRepo(UTest.testPath)

            // TEST
            expect(R).to.equal(true)
        })

        it([
            '2. string("Error: `directoryPath` is not a git repository!',
        ].join(' '), async () => {
            await UTest.createTestDirectory(UTest.testPath)
            const R = await U_INSTANCE.checkIsRepo(UTest.testPath)

            expect(R).to.equal([
                'Error:',
                UTest.testPath,
                'is not a git repository!',
            ].join(' '))
        })

        it([
            '3. string("Error: `directoryPath` not existant`!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkIsRepo('/some/very/weird/path')
            expect(R).to.equal(
                'Error: /some/very/weird/path not existant!',
            )
        })

    })

    describe('getBranchName()', async () => {

        it([
            '1. string(BRANCH_NAME)',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            const R = await U_INSTANCE.getBranchName(UTest.testPath)
            expect(R).to.equal('master')
        })

        it([
            '2. string("Error: `gitRepositoryPath` is not a git repository!")',
        ].join(' '), async () => {
            await UTest.createTestDirectory(UTest.testPath)
            const R = await U_INSTANCE.getBranchName(UTest.testPath)
            expect(R).to.equal([
                'Error:',
                UTest.testPath,
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

            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            const R = await U_INSTANCE.checkoutNewBranch(
                UTest.testPath,
                'feature/123',
            )
            expect(R).to.equal(true)
        })

        it([
            '2. branch existant',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            const R = await U_INSTANCE.checkoutNewBranch(
                UTest.testPath,
                'master',
            )
            expect(R).to.equal([
                'Error:',
                'Branch',
                'master',
                'already existant at',
                UTest.testPath,
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

            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            await U_INSTANCE.checkoutNewBranch(
                UTest.testPath,
                'feature/123',
            )
            const R = await U_INSTANCE.checkoutBranch(
                UTest.testPath,
                'master',
            )
            expect(R).to.equal(true)
        })

        it([
            '2. branch not existant',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            const R = await U_INSTANCE.checkoutBranch(
                UTest.testPath,
                'someWeirdBranchName',
            )
            expect(R).to.equal([
                'Error:',
                'Branch',
                'someWeirdBranchName',
                'not existant at',
                UTest.testPath,
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
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            await U_INSTANCE.checkoutNewBranch(
                UTest.testPath,
                'feature/123-test',
            )
            const R = await U_INSTANCE.checkIsFeatureBranch(UTest.testPath)
            expect(R).to.equal(true)
        })

        it([
            '2. string "Error: Current branch is not a feature branch!"',
        ].join(' '), async () => {
            await UTest.gitCreateTestRepositoryAtPath(UTest.testPath)
            const R = await U_INSTANCE.checkIsFeatureBranch(UTest.testPath)
            expect(R).to.equal([
                'Current Branch master in',
                UTest.testPath,
                'is not a feature branch!',
            ].join(' '))
        })

        it([
            '3. string "Error: not existant!',
        ].join(' '), async () => {
            const R = await U_INSTANCE.checkIsFeatureBranch(UTest.testPath)
            expect(R).to.equal([
                'Error:',
                UTest.testPath,
                'not existant!',
            ].join(' '))
        })

    })

    describe('checkIsMergableFromTo()', async () => {

        it([
            '1. boolean true: clean',
        ].join(' '), async () => {
            const README_PATH = PATH.resolve(UTest.testPath, 'README.md')
            const gitRepositoryPath = PATH.resolve(UTest.testPath)
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
        }).timeout(5000)

        it([
            '2. boolean true: unclean',
        ].join(' '), async () => {
            const README_PATH = PATH.resolve(UTest.testPath, 'README.md')
            const gitRepositoryPath = PATH.resolve(UTest.testPath)
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
        }).timeout(5000)

        it([
            '3. string: ERROR: merge conflic',
        ].join(' '), async () => {
            const README_PATH = PATH.resolve(UTest.testPath, 'README.md')
            const gitRepositoryPath = PATH.resolve(UTest.testPath)
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
        }).timeout(5000)

    }).timeout(10000)

    describe('commit()', async () => {
        it([
            '1. boolean(true) commitMessage default, filesToCommitTo default',
        ].join(' '), async () => {
            const gitRepositoryPath = PATH.resolve(UTest.testPath)
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
            const gitRepositoryPath = PATH.resolve(UTest.testPath)
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
            const gitRepositoryPath = PATH.resolve(UTest.testPath)
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
            const gitRepositoryPath = PATH.resolve(UTest.testPath)
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
            const gitRepositoryPath = PATH.resolve(UTest.testPath)
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
            const gitRepositoryPath = PATH.resolve(UTest.testPath)
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
            const gitRepositoryPath = PATH.resolve(UTest.testPath)
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

    // TODO
    // - create function, wich creates a backup?
    describe.only('copyOrCloneRepository()', async () => {

        it([
            '1. boolean=true: when target not existant',
            '(backupExistant=true --> copy)',
        ].join(' '), async () => {
            const R = await U_INSTANCE.copyOrCloneRepository(
                UConfig.testPath,
                UConfig.npmPackage.backupPath,
                UConfig.npmPackage.git.ssh,
                true,
            )
            expect(R).to.equal(true)
        })

        it([
            '2. boolean=true: when target existant, overwriteIfExistant=true',
            '(backupExistant=true --> copy)',
        ].join(' '), async () => {
            await UNpm.prepareNpmRepository()
            const R = await U_INSTANCE.copyOrCloneRepository(
                UConfig.testPath,
                UConfig.npmPackage.backupPath,
                UConfig.npmPackage.git.ssh,
                true,
            )
            expect(R).to.equal(true)
        })

        it([
            '3. boolean=true: when target not existant',
            '(backupExistant=false --> clone)',
        ].join(' '), async () => {
            // await UNpm.prepareNpmRepository()
            // const R = await U_INSTANCE.copyOrCloneRepository(
                // UConfig.testPath,
                // UConfig.npmPackage.backupPath,
                // UConfig.npmPackage.git.ssh,
                // true,
            // )
            // expect(R).to.equal(true)
            expect(0).to.equal(1) // fails

        })

    })

})
