// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'
import { utils } from 'mocha'

import { main } from './'

describe('index.ts', async () => {
    const filter = utils.stackTraceFilter()

    it('should start a job', async () => {
        // const R_RUN_MAIN = await main()
        await main()

        // TEST
        expect(1).to.equal(1) // passes

    })

})
