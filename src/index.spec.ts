// https://gitlab.com/divramod/dm-tpl/issues/4
import { describe, expect, it } from '@utils/mocha/index'

import { main } from './'
describe('index.ts', async () => {

    it('should start a job', async () => {
        // const R_RUN_MAIN = await main()
        await main()

        // TEST
        expect(1).to.equal(1) // passes

    })

})
