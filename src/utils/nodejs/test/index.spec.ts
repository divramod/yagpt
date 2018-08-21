// https://gitlab.com/divramod/dm-tpl/issues/7

// REQUIRE
const RIMRAF = require('rimraf')

// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UTest as U_INSTANCE, UTestUtility as U_CLASS } from './'

// TESTSUITE
describe(__filename, async () => {

    it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))
    it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    it('userInputCleanup(): 1 line', async () => {
        console.log([ // tslint:disable-line:no-console
            'some very very very very very very long input',
        ].join())
        const R = await U_INSTANCE.userInputCleanup(1)
        expect(R).to.equal(true)
    })

    it('userInputCleanup(): 3 lines', async () => {
        process.env.DMTPL_ENV = ''
        const R = await U_INSTANCE.userInputCleanup(3)
        expect(R).to.equal(false)
        process.env.DMTPL_ENV = 'testing'
    })

    it('getEnv()', async () => {
        const R = U_INSTANCE.getEnv()
        expect(R).to.equal('testing')
    })

    it('createTestDirectory(): success false (wrong path)', async () => {
        const DIRECTORY_PATH = '/bla'
        const R = await U_INSTANCE.createTestDirectory(DIRECTORY_PATH, true)
        expect(R.success).to.equal(false)
        expect(R.message).to.equal([
            'You can\'t use the directory',
            DIRECTORY_PATH,
            'for testing purposes! Please use a subdirectory of \'/tmp/test\'!',
        ].join(' '))
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
    })

    it([
        'createTestDirectory():',
        'success true (right path, deleteIfExistant=true)',
    ].join(' '), async () => {
        const DIRECTORY_PATH = '/tmp/test/nodejs/test'
        const R = await U_INSTANCE.createTestDirectory(DIRECTORY_PATH, true)
        expect(R.success).to.equal(true)
        expect(R.message).to.equal([
            'Directory',
            DIRECTORY_PATH,
            'removed and created',
        ].join(' '))
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
    })

    it([
        'createTestDirectory():',
        'success true (right path, deleteIfExistant=false)',
    ].join(' '), async () => {
        const DIRECTORY_PATH = '/tmp/test/nodejs/test'
        const R = await U_INSTANCE.createTestDirectory(DIRECTORY_PATH, false)
        expect(R.success).to.equal(true)
        expect(R.message).to.equal([
            'Directory',
            DIRECTORY_PATH,
            'existant and not created',
        ].join(' '))
        RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
    })

    it('gitCreateTestRepositoryAtPath(): success', async () => {
        const REPO_PATH = '/tmp/test/nodejs/git'
        const R_CREATED =
            await UTest.createTestDirectory(REPO_PATH)
        expect(R_CREATED.success).to.equal(true)
        const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(REPO_PATH)
        expect(R.success).to.equal(true)
        RIMRAF.sync(REPO_PATH) // REMOVE DIRECTORY
    })

    it([
        'gitCreateTestRepositoryAtPath():',
        'success',
        '(createDirectoryIfNotExistant=true)',
    ].join(' '), async () => {

        const REPO_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(REPO_PATH) // REMOVE DIRECTORY
        const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
            REPO_PATH,
            true,
        )
        expect(R.success).to.equal(true)

        const R1 = await U_INSTANCE.gitCreateTestRepositoryAtPath(
            REPO_PATH,
            false,
            true,
            true,
        )
        expect(R1.success).to.equal(true)
        RIMRAF.sync(REPO_PATH) // REMOVE DIRECTORY
    })

    it([
        'gitCreateTestRepositoryAtPath():',
        'success',
        '(removeDirectoryIfExistant=false)',
    ].join(' '), async () => {

        const REPO_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(REPO_PATH) // REMOVE DIRECTORY
        const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
            REPO_PATH,
            true,
        )
        expect(R.success).to.equal(true)

        const R1 = await U_INSTANCE.gitCreateTestRepositoryAtPath(
            REPO_PATH,
            true,
            false,
            true,
        )
        expect(R1.success).to.equal(true)
        RIMRAF.sync(REPO_PATH) // REMOVE DIRECTORY
    })

    it([
        'gitCreateTestRepositoryAtPath():',
        'success',
        '(rGRIE=false, rDIE=false)',
    ].join(' '), async () => {

        const REPO_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(REPO_PATH) // REMOVE DIRECTORY
        const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
            REPO_PATH,
            true,
        )
        expect(R.success).to.equal(true)

        const R1 = await U_INSTANCE.gitCreateTestRepositoryAtPath(
            REPO_PATH,
            true,
            false,
            false,
        )
        expect(R1.success).to.equal(true)
        RIMRAF.sync(REPO_PATH) // REMOVE DIRECTORY
    })

    it([
        'gitCreateTestRepositoryAtPath():',
        'failure',
        '(createDirectoryIfNotExistant=false)',
    ].join(' '), async () => {
        const REPO_PATH = '/tmp/test/nodejs/git'
        RIMRAF.sync(REPO_PATH) // REMOVE DIRECTORY
        const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
            REPO_PATH,
            false,
        )
        expect(R.success).to.equal(false)
        RIMRAF.sync(REPO_PATH) // REMOVE DIRECTORY
    })

})
