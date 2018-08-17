// https://gitlab.com/divramod/dm-tpl/issues/4
import { describe, expect, it } from '@utils/dmTpl/test/export'

import { main } from './'
describe(__filename, async () => {

    it('main()', async () => {
        // const R_RUN_MAIN = await main()
        const R = await main()

        // TEST
        expect(R).to.equal(true) // passes

    })

})
