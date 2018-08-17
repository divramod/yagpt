// https://gitlab.com/divramod/dm-tpl/issues/7
import { describe, expect, it } from '@utils/dmTpl/test/export'
import { Utility as Utility } from './'

// TESTSUITE
describe(__filename, async () => {

    it('test()', async () => {

        const U = Utility.getInstance()
        const R = await U.test()
        expect(R).to.equal(true)

    })

})
