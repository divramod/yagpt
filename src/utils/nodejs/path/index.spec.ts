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
