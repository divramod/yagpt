import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UPath as U_INSTANCE, UPathUtility as U_CLASS } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

describe('yaPath: ' + __filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    describe('createDirectory()', async () => {

        it([
            '1. boolean=true when not existant',
        ].join(' '), async () => {
            RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
            const R = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
            )
            expect(R).to.equal(true)
        })

        it([
            '2. boolean=true',
            'when existant and `deleteDirectoryIfExistant`=true',
        ].join(' '), async () => {
            await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
            )
            const R = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
                true,
            )
            expect(R).to.equal(true)
        })

        it([
            '3. string=ERROR:',
            'when existant and `deleteDirectoryIfExistant`=false',
        ].join(' '), async () => {
            const R_PREPARE = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
            )
            const R = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
                false,
            )
            expect(R).to.equal([
                'Directory',
                UTest.TEST_PATH,
                'existant and not created!',
            ].join(' '))
        })
    })

    describe('createFile()', async () => {

        it([
            '1. boolean=true When file not existant.',
        ].join(' '), async () => {
            await U_INSTANCE.createDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
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
            await U_INSTANCE.createDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
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
            await U_INSTANCE.createDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
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
                FILE_PATH,
                'existant!',
            ].join(' '))
        })

        it([
            '4. string=ERROR: When directory not existant',
        ].join(' '), async () => {
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
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
})
