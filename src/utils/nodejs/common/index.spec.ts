// https://gitlab.com/divramod/yagpt/issues/4
// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UCommon as U_INSTANCE, UCommonUtility as U_CLASS } from './'

// TESTSUITE
describe(__filename, async () => {

    it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

    it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    it('getResultObjectAtomic()', async () => {
        const RETURN_OBJECT = {
            error: undefined,
            message: undefined,
            success: undefined,
            value: undefined,
        }

        const R = U_INSTANCE.getResultObjectOne()
        expect(RETURN_OBJECT).to.deep.equal(R)

    })

    it('getResultObjectMultiple()', async () => {
        const RETURN_OBJECT = {
            error: undefined,
            message: undefined,
            results: {},
            success: undefined,
            value: undefined,
        }

        const R = await U_INSTANCE.getResultObjectMultiple()
        expect(RETURN_OBJECT).to.deep.equal(R)

    })

    it('getResultsObject()', async () => {

        const ATOMIC_RESULT_STRINGS = [
            'a',
            'b',
            'c',
        ]

        const ATOMIC_RESULT_OBJECT = {
            error: undefined,
            message: undefined,
            success: undefined,
            value: undefined,
        }

        const MULTIPLE_RESULT_OBJECT = {
            error: undefined,
            message: undefined,
            results: {
                a: Object.assign({}, ATOMIC_RESULT_OBJECT),
                b: Object.assign({}, ATOMIC_RESULT_OBJECT),
                c: Object.assign({}, ATOMIC_RESULT_OBJECT),
            },
            success: undefined,
            value: undefined,
        }

        const R = U_INSTANCE.getResultObjectMultiple()
        R.subresults = U_INSTANCE.getResultsObject(ATOMIC_RESULT_STRINGS)
        expect(R.subresults).to.deep.equal(MULTIPLE_RESULT_OBJECT.results)

    })
})
