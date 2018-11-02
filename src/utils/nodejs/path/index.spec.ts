import { UConfig } from '@utils/nodejs/config'
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UPath as U_INSTANCE, UPathUtility as U_CLASS } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

describe('yaPath: ' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UConfig.testPath) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UConfig.testPath) // REMOVE DIRECTORY
    })

    describe('checkIfPathIsDirectory()', async () => {

        it([
            'true: if path is directory',
        ].join(' '), async () => {
            const TEST_PATH = UConfig.testPath
            RIMRAF.sync(TEST_PATH)
            UTest.createTestDirectory(TEST_PATH)
            const R = await U_INSTANCE.checkIfPathIsDirectory(
                TEST_PATH,
            )
            expect(R).to.equal(true)
        })

        it([
            'false: if path is no directory',
        ].join(' '), async () => {
            const TEST_PATH = UConfig.testPath
            RIMRAF.sync(TEST_PATH)
            const R = await U_INSTANCE.checkIfPathIsDirectory(
                TEST_PATH,
            )
            expect(R).to.equal(false)
        })

    })

    describe('checkIfPathIsFile()', async () => {

        it([
            'true: if path is file',
        ].join(' '), async () => {
            const TEST_DIRECTORY_PATH = UConfig.testPath
            const TEST_FILE_PATH = PATH.resolve(UConfig.testPath, 'test.md')
            UTest.createTestDirectory(TEST_DIRECTORY_PATH)
            UTest.createTestFile(TEST_FILE_PATH)
            const R = await U_INSTANCE.checkIfPathIsFile(
                TEST_FILE_PATH,
            )
            expect(R).to.equal(true)
        })

        it([
            'false: if path is no file',
        ].join(' '), async () => {
            const TEST_FILE_PATH = PATH.resolve(UConfig.testPath, 'test.md')
            RIMRAF.sync(TEST_FILE_PATH)
            const R = await U_INSTANCE.checkIfPathIsFile(
                TEST_FILE_PATH,
            )
            expect(R).to.equal(false)
        })

    })

    describe('checkIfPathExists()', async () => {

        it([
            'true: when path exists',
        ].join(' '), async () => {
            const TEST_PATH = UConfig.testPath
            RIMRAF.sync(TEST_PATH)
            UTest.createTestDirectory(TEST_PATH)
            const R = await U_INSTANCE.checkIfPathExists(
                TEST_PATH,
            )
            expect(R).to.equal(true)
        })

        it([
            'false: when path doesn\'t exists',
        ].join(' '), async () => {
            const TEST_PATH = UConfig.testPath
            RIMRAF.sync(TEST_PATH)
            const R = await U_INSTANCE.checkIfPathExists(
                TEST_PATH,
            )
            expect(R).to.equal(false)
        })

    })

    describe('createDirectory()', async () => {

        it([
            '1. boolean=true when not existant',
        ].join(' '), async () => {
            RIMRAF.sync(UConfig.testPath) // REMOVE DIRECTORY
            const R = await U_INSTANCE.createDirectory(
                UConfig.testPath,
            )
            expect(R).to.equal(true)
        })

        it([
            '2. boolean=true',
            'when existant and `deleteDirectoryIfExistant`=true',
        ].join(' '), async () => {
            await U_INSTANCE.createDirectory(
                UConfig.testPath,
            )
            const R = await U_INSTANCE.createDirectory(
                UConfig.testPath,
                true,
            )
            expect(R).to.equal(true)
        })

        it([
            '3. string=ERROR:',
            'when existant and `deleteDirectoryIfExistant`=false',
        ].join(' '), async () => {
            const R_PREPARE = await U_INSTANCE.createDirectory(
                UConfig.testPath,
            )
            const R = await U_INSTANCE.createDirectory(
                UConfig.testPath,
                false,
            )
            expect(R).to.equal([
                'ERROR:',
                'Directory',
                UConfig.testPath,
                'existant and not created!',
            ].join(' '))
        })
    })

    describe('createFile()', async () => {

        it([
            '1. boolean=true When file not existant.',
        ].join(' '), async () => {
            await U_INSTANCE.createDirectory(UConfig.testPath)
            const FILE_PATH = PATH.resolve(
                UConfig.testPath,
                'sometest.json',
            )
            const R = await U_INSTANCE.createFile(
                FILE_PATH,
            )
            expect(R).to.equal(true)
        })

        it([
            '2. boolean=ture When file existant and `overwriteIfExistant`=true',
        ].join(' '), async () => {
            await U_INSTANCE.createDirectory(UConfig.testPath)
            const FILE_PATH = PATH.resolve(
                UConfig.testPath,
                'test.json',
            )
            await U_INSTANCE.createFile(
                FILE_PATH,
                JSON.stringify({
                    name: 'test',
                }),
            )
            const R = await U_INSTANCE.createFile(
                FILE_PATH,
                JSON.stringify({
                    name: 'test',
                }),
                true,
            )
            expect(R).to.equal(true)
        })

        it([
            '3. string=ERROR:',
            'When file existant and `overwriteIfExistant`=false',
        ].join(' '), async () => {
            await U_INSTANCE.createDirectory(UConfig.testPath)
            const FILE_PATH = PATH.resolve(
                UConfig.testPath,
                'test.json',
            )
            await U_INSTANCE.createFile(
                FILE_PATH,
                JSON.stringify({
                    name: 'test',
                }),
            )
            const R = await U_INSTANCE.createFile(
                FILE_PATH,
                JSON.stringify({
                    name: 'test',
                }),
            )
            expect(R).to.equal([
                'ERROR:',
                FILE_PATH,
                'existant!',
            ].join(' '))
        })

        it([
            '4. string=ERROR: When directory not existant',
        ].join(' '), async () => {
            const FILE_PATH = PATH.resolve(
                UConfig.testPath,
                'test.json',
            )
            const R = await U_INSTANCE.createFile(
                FILE_PATH,
                JSON.stringify({
                    name: 'test',
                }),
            )
            expect(R).to.equal([
                'ERROR:',
                'Directory',
                PATH.dirname(FILE_PATH),
                'not existant!',
            ].join(' '))
        })
    })

    describe('copyDirectory()', async () => {

        it([
            '1. boolean=true: when src existant and target not existant',
        ].join(' '), async () => {
            await UTest.createTestDirectory(
                PATH.resolve(UConfig.testPath, 'src'),
                true,
            )
            const R = await U_INSTANCE.copyDirectory(
                PATH.resolve(UConfig.testPath, 'src'),
                PATH.resolve(UConfig.testPath, 'target'),
            )
            expect(R).to.equal(true)
        })

        it([
            '2. boolean=true:',
            'when src existant and target existant and',
            'overwriteIfExistant=true',
        ].join(' '), async () => {
            await UTest.createTestDirectory(
                PATH.resolve(UConfig.testPath, 'src'),
                true,
            )
            await UTest.createTestDirectory(
                PATH.resolve(UConfig.testPath, 'target'),
                true,
            )
            const R = await U_INSTANCE.copyDirectory(
                PATH.resolve(UConfig.testPath, 'src'),
                PATH.resolve(UConfig.testPath, 'target'),
                true,
            )
            expect(R).to.equal(true)
        })

        it([
            '3. string=ERROR:',
            'when src existant and target existant and',
            'overwriteIfExistant=false',
        ].join(' '), async () => {
            await UTest.createTestDirectory(
                PATH.resolve(UConfig.testPath, 'src'),
                true,
            )
            await UTest.createTestDirectory(
                PATH.resolve(UConfig.testPath, 'target'),
                true,
            )
            const R = await U_INSTANCE.copyDirectory(
                PATH.resolve(UConfig.testPath, 'src'),
                PATH.resolve(UConfig.testPath, 'target'),
                false,
            )
            expect(R).to.contain('ERROR')
        })

        it([
            '4. string=ERROR: when src not existant',
        ].join(' '), async () => {
            const R = await U_INSTANCE.copyDirectory(
                PATH.resolve(UConfig.testPath, 'src'),
                PATH.resolve(UConfig.testPath, 'target'),
            )
            expect(R).to.contain('ERROR')
        })

    })
})
