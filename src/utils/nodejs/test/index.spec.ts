// https://gitlab.com/divramod/yagpt/issues/7

// REQUIRE
const RIMRAF = require('rimraf')
const PATH = require('path')
const SHELL = require('shelljs')

// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UTest as U_INSTANCE, UTestUtility as U_CLASS } from './'

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

})
