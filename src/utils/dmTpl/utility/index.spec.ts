// https://gitlab.com/divramod/dm-tpl/issues/7
import { describe, expect, it } from '@utils/dmTpl/test/export'
import { Utility as Utility } from './'

// TESTSUITE
describe(__filename, async () => {

    it('constructor()', async () => {

        try {
            const U = new Utility()
        } catch (e) {
            expect(e.message).to.equal('Error: Instantiation failed: Use Utility.getInstance() instead of new.')
        }

    })

    it('getInstance()', async () => {

        const U = Utility.getInstance()
        const U1 = Utility.getInstance()
        expect(U).to.deep.equal(U1)

    })

})
