// https://gitlab.com/divramod/dm-tpl/issues/4
import { describe, expect, it } from '@utils/dmTpl/test/export'

import { main } from './'
describe(__filename, async () => {

    it('main()', async () => {
        // const R_RUN_MAIN = await main()
        await main()

        // TEST
        expect(1).to.equal(1) // passes

    })

})
