// https://gitlab.com/divramod/yagpt/issues/4
// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UPath as U_INSTANCE, UPathUtility as U_CLASS } from './'

// REQUIRE
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

// TYPINGS
import { IResult } from '@utils/nodejs/common'

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

            // PREPARE

            // RUN
            const R: IResult = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
            )

            // TEST
            expect(R.value).to.equal(true)
            expect(R.message).to.equal([
                'Directory',
                UTest.TEST_PATH,
                'created!',
            ].join(' '))

        })

        it([
            'success:',
            'bDeleteIfDirectoryExistant true',
        ].join(' '), async () => {

            // PREPARE

            // RUN
            const R_PREPARE: IResult = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
            )
            const R: IResult = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
                true,
            )

            // TEST
            expect(R.value).to.equal(true)
            expect(R.message).to.equal([
                'Directory',
                UTest.TEST_PATH,
                'removed and created!',
            ].join(' '))

        })

        it([
            'success:',
            'bDeleteIfDirectoryExistant false',
        ].join(' '), async () => {

            // PREPARE

            // RUN
            const R_PREPARE: IResult = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
            )
            const R: IResult = await U_INSTANCE.createDirectory(
                UTest.TEST_PATH,
                false,
            )

            // TEST
            expect(R.value).to.equal(false)
            expect(R.message).to.equal([
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

            // PREPARE
            await U_INSTANCE.createDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
                'test.json',
            )

                // RUN
            const R: IResult =
                await U_INSTANCE.createFile(
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
            'file created,',
            'content default',
        ].join(' '), async () => {

            // PREPARE
            await U_INSTANCE.createDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
                'test.json',
            )

                // RUN
            const R: IResult =
                await U_INSTANCE.createFile(
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
            'file existant, overwrite true',
        ].join(' '), async () => {

            // PREPARE
            await U_INSTANCE.createDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
                'test.json',
            )
            const R_PREPARE: IResult =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

                // RUN
            const R: IResult =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
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
            'file existant, overwrite false',
        ].join(' '), async () => {

            // PREPARE
            await U_INSTANCE.createDirectory(UTest.TEST_PATH)
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
                'test.json',
            )
            const R_PREPARE: IResult =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

                // RUN
            const R: IResult =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

            // TEST
            expect(R.value).not.to.equal(undefined)
            expect(R.message).to.equal([
                FILE_PATH,
                'existant!',
            ].join(' '))
        })

        it([
            'failure:',
            'directory not existant',
        ].join(' '), async () => {

            // PREPARE
            const FILE_PATH = PATH.resolve(
                UTest.TEST_PATH,
                'test.json',
            )

                // RUN
            const R: IResult =
                await U_INSTANCE.createFile(
                    FILE_PATH,
                    JSON.stringify({
                        name: 'test',
                    }),
                )

            // TEST
            expect(R.value).not.to.equal(undefined)
            expect(R.message).to.equal([
                'Directory',
                PATH.dirname(FILE_PATH),
                'not existant!',
            ].join(' '))
        })

    })

})
