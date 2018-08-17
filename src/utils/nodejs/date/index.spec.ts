// https://gitlab.com/divramod/dm-tpl/issues/7
import { describe, expect, it } from '@utils/dmTpl/test/export'
import { UDate as Utility } from './'

// TESTSUITE
describe(__filename, async () => {

    it('constructor()', async () => {

        try {
            const U = new Utility()
        } catch (e) {
            expect(e.message).to.equal('Error: Instantiation failed: Use UDate.getInstance() instead of new.')
        }

    })

    it('getDateDiff()', async () => {

        const DATE1 = +new Date()
        const DATE2 = +new Date()
        const DIFF = (DATE2 - DATE1)
        const U = Utility.getInstance()
        const R = U.getDateDiff(DATE1, DATE2)

        expect(R).to.equal(DIFF)

    })

})
