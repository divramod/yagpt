// https://gitlab.com/divramod/dm-tpl/issues/4
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UGit as U_INSTANCE, UGitUtility as U_CLASS } from './'
const RIMRAF = require('rimraf')
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// TESTSUITE
describe(__filename, async () => {

    it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

    it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    it('init()', async () => {

        const R = await U_INSTANCE.init(__dirname)
        expect(R).to.equal(true)

    })

    it([
        'checkIsRepo()',
        'fail',
        'no repo at created path',
    ].join(' '), async () => {
        const DIRECTORY_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
        await UTest.createTestDirectory(DIRECTORY_PATH)
        const R: boolean = await U_INSTANCE.checkIsRepo(DIRECTORY_PATH)
        expect(R).to.equal(false)
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
    })

    it([
        'checkIsRepo()',
        'success',
        'created repo at path',
    ].join(' '), async () => {
        const DIRECTORY_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
        await UTest.gitCreateTestRepositoryAtPath(DIRECTORY_PATH)
        const R: boolean = await U_INSTANCE.checkIsRepo(DIRECTORY_PATH)
        expect(R).to.equal(true)
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
    })

    it('getBranchName(): success at created repo', async () => {
        const DIRECTORY_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
        await UTest.gitCreateTestRepositoryAtPath(DIRECTORY_PATH)
        const R = await U_INSTANCE.getBranchName(DIRECTORY_PATH)
        expect(R).to.equal('master')
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
    })

    it('getBranchName(): fail no repository', async () => {
        const DIRECTORY_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
        await UTest.createTestDirectory(DIRECTORY_PATH)
        const R = await U_INSTANCE.getBranchName(DIRECTORY_PATH)
        expect(R).to.equal(undefined)
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
    })

    it([
        'checkoutBranch():',
        'success',
        'at created repo',
    ].join(' '), async () => {
        const GIT_REPOSITORY_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(GIT_REPOSITORY_PATH) // REMOVE DIRECTORY
        await UTest.gitCreateTestRepositoryAtPath(GIT_REPOSITORY_PATH)
        const R: boolean =
            await U_INSTANCE.checkoutBranch(GIT_REPOSITORY_PATH, 'feature/123')
        expect(R).to.equal(true)
        RIMRAF.sync(GIT_REPOSITORY_PATH) // REMOVE DIRECTORY
    })

    it([
        'checkoutBranch():',
        'fail',
        'at created dir',
    ].join(' '), async () => {
        const GIT_REPOSITORY_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(GIT_REPOSITORY_PATH) // REMOVE DIRECTORY
        await UTest.createTestDirectory(GIT_REPOSITORY_PATH)
        const R: boolean =
            await U_INSTANCE.checkoutBranch(GIT_REPOSITORY_PATH, 'feature/123')
        expect(R).to.equal(false)
        RIMRAF.sync(GIT_REPOSITORY_PATH) // REMOVE DIRECTORY
    })

    it('isFeatureBranch(): fail not a git repo', async () => {

        const DIRECTORY_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
        await UTest.createTestDirectory(DIRECTORY_PATH)

        const R = await U_INSTANCE.isFeatureBranch(DIRECTORY_PATH)
        expect(R.value).to.equal(false)
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY

    })

    it('isFeatureBranch(): fail at created repo', async () => {

        const GIT_REPOSITORY_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(GIT_REPOSITORY_PATH) // REMOVE DIRECTORY
        await UTest.gitCreateTestRepositoryAtPath(GIT_REPOSITORY_PATH)
        const R = await U_INSTANCE.isFeatureBranch(GIT_REPOSITORY_PATH)
        expect(R.value).to.equal(false)
        expect(R.message).to.equal('Is not a Feature Branch')
        RIMRAF.sync(GIT_REPOSITORY_PATH) // REMOVE DIRECTORY
    })

    it([
        'isFeatureBranch()',
        'success',
        'at created repo and checked out feature branch',
    ].join(' '), async () => {
        const GIT_REPOSITORY_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(GIT_REPOSITORY_PATH) // REMOVE DIRECTORY
        await UTest.gitCreateTestRepositoryAtPath(GIT_REPOSITORY_PATH)
        await U_INSTANCE.checkoutBranch(GIT_REPOSITORY_PATH, 'feature/123')
        const R = await U_INSTANCE.isFeatureBranch(GIT_REPOSITORY_PATH)
        expect(R.value).to.equal(true)
        RIMRAF.sync(GIT_REPOSITORY_PATH) // REMOVE DIRECTORY
    })

})
