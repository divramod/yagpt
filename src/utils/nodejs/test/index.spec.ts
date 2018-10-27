const RIMRAF = require('rimraf')
const PATH = require('path')
const SHELL = require('shelljs')

// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UTest as U_INSTANCE, UTestUtility as U_CLASS } from './'

// TESTSUITE
describe('yaTest ' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.testPath) // REMOVE DIRECTORY
        process.env.DMTPL_ENV = 'testing'
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.testPath) // REMOVE DIRECTORY
        process.env.DMTPL_ENV = 'testing'
    })

    describe('getEnv()', async () => {

        it([
            '1. should return the before set process environment',
        ].join(' '), async () => {
            process.env.DMTPL_ENV = 'testing'
            const R = await UTest.getEnv()
            expect(R).to.equal('testing')
        })

    })

    describe('userInputCleanup()', async () => {
        it([
            '1. boolean=true: when cleanup was run and env=testing',
        ].join(' '), async () => {
            process.env.DMTPL_ENV = 'testing'
            console.log( // tslint:disable-line:no-console
                'the line to delete',
            )
            const R = await UTest.userInputCleanup(1)
            expect(R).to.equal(true)
        })

        it([
            '2. boolean=false: env=something',
        ].join(' '), async () => {
            process.env.DMTPL_ENV = 'something'
            const R = await UTest.userInputCleanup(1)
            process.env.DMTPL_ENV = 'testing'
            expect(R).to.equal(false)
        })

    })

    describe('gitCreateTestRepositoryAtPath()', async () => {

        it([
            '1. boolean=true: if directory not existant',
        ].join(' '), async () => {
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.testPath,
            )
            expect(R).to.equal(true)
        })

        it([
            '2. boolean=true:',
            'if directory existant and removeDirectoryIfExistant=true',
        ].join(' '), async () => {
            await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.testPath,
            )
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.testPath,
                true,
            )
            expect(R).to.equal(true)
        })

        it([
            '3. string=ERROR:',
            'if directory existant and if removeDirectoryIfExistant=false',
        ].join(' '), async () => {
            await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.testPath,
            )
            const R = await U_INSTANCE.gitCreateTestRepositoryAtPath(
                UTest.testPath,
                false,
            )
            expect(R).to.equal([
                'ERROR: directory existant!',
            ].join(' '))
        })

    })

    describe('createTestDirectory()', async () => {

        it([
            '1. boolean true: if directory not existant',
        ].join(' '), async () => {
            const R = await U_INSTANCE.createTestDirectory(
                UTest.testPath,
            )
            expect(R).to.equal(true)
        })

        it([
            '2. boolean true: if directory existant and',
            'deleteDirectoryIfExistant=true',
        ].join(' '), async () => {
            await U_INSTANCE.createTestDirectory(
                UTest.testPath,
            )
            const R = await U_INSTANCE.createTestDirectory(
                UTest.testPath,
                true,
            )
            expect(R).to.equal(true)
        })

        it([
            '3. string ERROR: if directory existant and',
            'deleteDirectoryIfExistant=false',
        ].join(' '), async () => {
            await U_INSTANCE.createTestDirectory(
                UTest.testPath,
            )
            const R = await U_INSTANCE.createTestDirectory(
                UTest.testPath,
                false,
            )
            expect(R).to.contain('ERROR')
        })

        it([
            '4. string ERROR: if directory is not in path /tmp/test',
        ].join(' '), async () => {
            const R = await U_INSTANCE.createTestDirectory(
                '/tmp/test1',
                false,
            )
            expect(R).to.contain('ERROR')
        })

    })

    describe('createTestFile()', async () => {

        it([
            '1. boolean true: if file not existant',
        ].join(' '), async () => {
            await U_INSTANCE.createTestDirectory(
                UTest.testPath,
            )
            const R = await U_INSTANCE.createTestFile(
                PATH.resolve(
                    UTest.testPath,
                    'blabii.txt',
                ),
            )
            expect(R).to.equal(true)
        })

        it([
            '2. boolean true: if file existant and overwriteIfExistant=true',
        ].join(' '), async () => {
            await U_INSTANCE.createTestDirectory(
                UTest.testPath,
            )
            await U_INSTANCE.createTestFile(
                PATH.resolve(
                    UTest.testPath,
                    'blabii.txt',
                ),
            )
            const R = await U_INSTANCE.createTestFile(
                PATH.resolve(
                    UTest.testPath,
                    'blabii.txt',
                ),
                '',
                true,
            )
            expect(R).to.equal(true)
        })

        it([
            '3. string ERROR: if file existant and overwriteIfExistant=false',
        ].join(' '), async () => {
            await U_INSTANCE.createTestDirectory(
                UTest.testPath,
            )
            await U_INSTANCE.createTestFile(
                PATH.resolve(
                    UTest.testPath,
                    'blabii.txt',
                ),
            )
            const R = await U_INSTANCE.createTestFile(
                PATH.resolve(
                    UTest.testPath,
                    'blabii.txt',
                ),
                '',
                false,
            )
            expect(R).to.contain('ERROR')
        })

        it([
            '4. string ERROR: not in /tmp/test when not in /tmp/test',
        ].join(' '), async () => {
            const R = await U_INSTANCE.createTestFile(
                PATH.resolve(
                    '/tmp/test1',
                    'blabii.txt',
                ),
                '',
                false,
            )
            expect(R).to.contain('ERROR')
        })

    })

})
