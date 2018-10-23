// https://gitlab.com/divramod/yagpt/issues/7

// REQUIRE
const RIMRAF = require('rimraf')
const PATH = require('path')
const SHELL = require('shelljs')

// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UTest as U_INSTANCE, UTestUtility as U_CLASS } from './'

// TYPINGS
import { IResult } from '@utils/nodejs/common'

// TESTSUITE
describe(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
        process.env.DMTPL_ENV = 'testing'
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
        process.env.DMTPL_ENV = 'testing'
    })

    describe('UTest.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))
        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe('UTest.userInputCleanup()', async () => {

        it([
            'success',
            '1 line',
        ].join(' '), async () => {
            console.log([ // tslint:disable-line:no-console
                'some very very very very very very long input',
            ].join())
            const R = await U_INSTANCE.userInputCleanup(1)
            expect(R).to.equal(true)
        })

        it([
            'success',
            '3 lines',
        ].join(' '), async () => {
            process.env.DMTPL_ENV = ''
            const R = await U_INSTANCE.userInputCleanup(3)
            expect(R).to.equal(false)
            process.env.DMTPL_ENV = 'testing'
        })

    })

    describe('UTest.getEnv()', async () => {

        it('success', async () => {
            const R = U_INSTANCE.getEnv()
            expect(R).to.equal('testing')
        })

    })

    describe('UTest.createTestDirectory()', async () => {

        it([
            'createTestDirectory():',
            'failure:',
            'wrong path,',
        ].join(' '), async () => {
            const WRONG_DIRECTORY_PATH = '/bla'
            const R = await U_INSTANCE.createTestDirectory(
                WRONG_DIRECTORY_PATH,
                true,
            )
            expect(R.value).to.equal(false)
            expect(R.message).to.equal([
                'You can\'t use the directory',
                WRONG_DIRECTORY_PATH,
                'for testing purposes!',
                'Please use a subdirectory of \'/tmp/test\'!',
            ].join(' '))
        })

        it([
            'createTestDirectory():',
            'success:',
            'right path,',
            'deleteIfExistant true',
        ].join(' '), async () => {
            const R_PREPARE =
                await U_INSTANCE.createTestDirectory(UTest.TEST_PATH)
            const R =
                await U_INSTANCE.createTestDirectory(UTest.TEST_PATH, true)
            expect(R.value).to.equal(true)
            expect(R.message).to.equal([
                'Directory',
                UTest.TEST_PATH,
                'removed and created!',
            ].join(' '))
        })

        it([
            'createTestDirectory():',
            'success:',
            'right path,',
            'deleteIfExistant false',
        ].join(' '), async () => {
            const R_PREPARE =
                await U_INSTANCE.createTestDirectory(UTest.TEST_PATH)
            const R =
                await U_INSTANCE.createTestDirectory(UTest.TEST_PATH, false)
            expect(R.value).to.equal(false)
            expect(R.message).to.equal([
                'Directory',
                UTest.TEST_PATH,
                'existant and not created!',
            ].join(' '))
        })

    })

    describe('UTest.gitCreateTestRepositoryAtPath()', async () => {

        it([
            'success',
        ].join(' '), async () => {

            // RUN
            const R_CREATED =
                await UTest.createTestDirectory(UTest.TEST_PATH)

            // TEST
            expect(R_CREATED.value).to.equal(true)

            // RUN
            const R =
                await U_INSTANCE.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // TEST
            expect(R.value).to.equal(true)
        })

        it([
            'success:',
            'createDirectoryIfNotExistant true',
        ].join(' '), async () => {

            // RUN
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.TEST_PATH,
                true,
            )

            // TEST
            expect(R.value).to.equal(true)

            // RUN
            const R1 = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.TEST_PATH,
                false,
                true,
                true,
            )

            // TEST
            expect(R1.value).to.equal(true)

        })

        it([
            'success:',
            'removeDirectoryIfExistant false',
        ].join(' '), async () => {

            // RUN
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.TEST_PATH,
                true,
            )

            // TEST
            expect(R.value).to.equal(true)

            // RUN
            const R1 = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.TEST_PATH,
                true,
                false,
                true,
            )

            // TEST
            expect(R1.value).to.equal(true)

        })

        it([
            'success:',
            'rGRIE false, rDIE false',
        ].join(' '), async () => {

            // RUN
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.TEST_PATH,
                true,
            )

            // TEST
            expect(R.value).to.equal(true)

            // RUN
            const R1 = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.TEST_PATH,
                true,
                false,
                false,
            )

            // TEST
            expect(R1.value).to.equal(true)

        })

        it([
            'failure:',
            'createDirectoryIfNotExistant false',
        ].join(' '), async () => {

            // RUN
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.TEST_PATH,
                false,
            )

            // TEST
            expect(R.value).to.equal(false)

        })

    })

    describe('UTest.createTestFile()', async () => {

        it([
            'success:',
            'file created',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
                'test.json',
            )

            // RUN
            const R: IResult =
                await U_INSTANCE.createTestFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

            // TEST
            expect(R.value).not.to.equal(undefined)
            expect(R.message).to.equal([
                FILE_PATH,
                'created!',
            ].join(' '))
        })

        it([
            'success:',
            'file created',
            'FILE_CONTENT = \'\'',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
                'test.json',
            )

            // RUN
            const R: IResult =
                await U_INSTANCE.createTestFile(
                    FILE_PATH,
                )

            // TEST
            expect(R.value).not.to.equal(undefined)
            expect(R.message).to.equal([
                FILE_PATH,
                'created!',
            ].join(' '))
        })

        it([
            'success:',
            'file created',
            'OVERWRITE_IF_EXISTANT = true',
        ].join(' '), async () => {

            // PREPARE
            await UTest.createTestDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
                'test.json',
            )
            const R_PREPARE_FILE: IResult =
                await U_INSTANCE.createTestFile(
                    FILE_PATH,
                    'test',
                )

            // RUN
            const R: IResult =
                await U_INSTANCE.createTestFile(
                    FILE_PATH,
                    'test',
                    true,
                )

            // TEST
            expect(R.value).not.to.equal(undefined)
            expect(R.message).to.equal([
                FILE_PATH,
                'overwritten!',
            ].join(' '))
        })

        it([
            'failure:',
            'directory not in',
            UTest.TEST_PATH,
        ].join(' '), async () => {

            // PREPARE
            const FILE_PATH = PATH.resolve(
                process.cwd(),
                'test.json',
            )

            // RUN
            const R: IResult =
                await U_INSTANCE.createTestFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

            // TEST
            expect(R.value).not.to.equal(undefined)
            expect(R.message).to.equal([
                FILE_PATH,
                'not in',
                UTest.TEST_PATH,
            ].join(' '))
        })

    })

    describe('UTest.prepareNpmRepository()', async () => {

        beforeEach(async () => {
            RIMRAF.sync(UTest.NPM_REPOSITORY.path) // REMOVE DIRECTORY
            process.env.DMTPL_ENV = 'testing'
        })

        it([
            'success:',
            'package cloned!',
        ].join(' '), async () => {

            // PREPARE
            RIMRAF.sync(UTest.NPM_REPOSITORY.path_backup)
            RIMRAF.sync(UTest.NPM_REPOSITORY.path)

            // RUN
            const R: IResult = await U_INSTANCE.prepareNpmRepository()

            // RESTORE BACKUP COPY
            await SHELL.cp(
                '-Rf',
                UTest.NPM_REPOSITORY.path,
                UTest.NPM_REPOSITORY.path_backup,
            )

            // TEST
            expect(R.value).to.equal(true)
            expect(R.message).to.equal( [
                UTest.NPM_REPOSITORY.path,
                'cloned!',
            ].join(' ') )

        }).timeout(60000)

        it([
            'success:',
            'package copied!',
        ].join(' '), async () => {

            // PREPARE
            RIMRAF.sync(UTest.NPM_REPOSITORY.path)

            // RUN
            const R: IResult = await U_INSTANCE.prepareNpmRepository()

            // RESTORE BACKUP COPY
            await SHELL.cp(
                '-Rf',
                UTest.NPM_REPOSITORY.path,
                UTest.NPM_REPOSITORY.path_backup,
            )

            // TEST
            expect(R.value).to.equal(true)
            expect(R.message).to.equal( [
                UTest.NPM_REPOSITORY.path,
                'copied!',
            ].join(' ') )

        }).timeout(60000)

        it([
            'success:',
            'package already existant!',
        ].join(' '), async () => {

            // PREPARE
            const R_PREPARE: IResult =
                await U_INSTANCE.prepareNpmRepository()

            // RUN
            const R: IResult = await U_INSTANCE.prepareNpmRepository()

            // TEST
            expect(R.value).to.equal(false)
            expect(R.message).to.equal( [
                UTest.NPM_REPOSITORY.path,
                'already existant!',
            ].join(' ') )

        }).timeout(60000)

    })

    describe('UTest.gitCleanRepository()', async () => {

        it([
            'success:',
            'cleaned unclean repository',
        ].join(' '), async () => {

            // PREPARE
            // create repo
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)
            // make repo unclean
            await SHELL.touch(
                PATH.resolve(
                    UTest.TEST_PATH,
                    'make-unclean.ts',
                ),
            )

            // RUN
            const R: IResult =
                await U_INSTANCE.gitCleanRepository(
                    UTest.TEST_PATH,
                    'testing',
                )

            // TEST
            expect(R.value).to.equal(true)
            expect(R.message).to.equal( [
                UTest.TEST_PATH,
                'repository cleaned!',
            ].join(' ') )

        })

        it([
            'error:',
            'repository already clean',
        ].join(' '), async () => {

            // PREPARE
            // create repo
            await UTest.gitCreateTestRepositoryAtPath(UTest.TEST_PATH)

            // RUN
            const R: IResult =
                await U_INSTANCE.gitCleanRepository(
                    UTest.TEST_PATH,
                    'testing',
                )

            // TEST
            expect(R.value).to.equal(false)
            expect(R.message).to.equal( [
                UTest.TEST_PATH,
                'repository already clean!',
            ].join(' ') )

        })

        it([
            'error:',
            'repository not existant',
        ].join(' '), async () => {

            // PREPARE

            // RUN
            const R: IResult =
                await U_INSTANCE.gitCleanRepository(
                    UTest.TEST_PATH,
                    'testing',
                )

            // TEST
            expect(R.value).to.equal(false)
            expect(R.message).to.equal( [
                UTest.TEST_PATH,
                'not existant!',
            ].join(' ') )

        })

    })

})
