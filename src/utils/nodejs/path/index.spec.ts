// https://gitlab.com/divramod/dm-tpl/issues/4
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UPath as U_INSTANCE, UPathUtility as U_CLASS } from './'

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// TESTSUITE
describe(__filename, async () => {

    it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

    it('constructor()', UTest.utilityTestConstructor(U_CLASS))

})
