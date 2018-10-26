// https://gitlab.com/divramod/yagpt/issues/4
// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UPath as U_INSTANCE, UPathUtility as U_CLASS } from './'

// REQUIRE
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

// TESTSUITE
describe(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    describe('UPath.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe('UPath.createDirectory()', async () => {

        it([
            'success',
        ].join(' '), async () => {
            const R = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
            )
            expect(R).to.equal(true)
        })

        it([
            'success:',
            'bDeleteIfDirectoryExistant true',
        ].join(' '), async () => {
            const R_PREPARE = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
            )
            const R = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
                true,
            )
            expect(R).to.equal(true)
        })

        it([
            'success:',
            'bDeleteIfDirectoryExistant false',
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

    describe('UPath.createFile()', async () => {

        it([
            'success:',
            'file created',
        ].join(' '), async () => {
            await U_INSTANCE.createDirectory(UTest.TEST_PATH)
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
            expect(R).to.equal(true)
        })

        it([
            'success:',
            'file created,',
            'content default',
        ].join(' '), async () => {
            await U_INSTANCE.createDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
                'test.json',
            )
            const R = await U_INSTANCE.createFile(
                    FILE_PATH,
                )
            expect(R).to.equal(true)
        })

        it([
            'success:',
            'file existant, overwrite true',
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
            'failure:',
            'file existant, overwrite false',
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
            'failure:',
            'directory not existant',
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
                'Directory',
                PATH.dirname(FILE_PATH),
                'not existant!',
            ].join(' '))
        })
    })
})
