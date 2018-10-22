// https://gitlab.com/divramod/dm-tpl/issues/3
// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UTemplate as U_INSTANCE, UTemplateUtility as U_CLASS } from './'

// REQUIRE
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// TESTSUITE
describe(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    afterEach(async () => {
        RIMRAF.sync(UTest.TEST_PATH) // REMOVE DIRECTORY
    })

    describe('UTemplate.class()', async () => {

        it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

        it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    })

    describe('UTemplate.isTemplateExistant()', async () => {

        it([
            'success:',
            'template is existant',
        ].join(' '), async () => {

            // RUN
            const R = await U_INSTANCE.isTemplateExistant('apiTsSimple')

            // TEST
            expect(R).to.equal(true)

        })

    })

})
