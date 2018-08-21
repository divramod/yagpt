// gitlab.com/divramod/dm-tpl/issues/4
import { describe, expect, it } from '@utils/nodejs/test'
// import { main } from './'

describe(__filename, async () => {

    it('main() env="testing"', async () => {
        const RE = require('./')
        const R = await RE.main()
        expect(R).to.equal(false) // passes

    })

    it('main() env="production"', async () => {

        // TEST
        const RE = require('./')
        process.env.DMTPL_ENV = 'production'
        const R = await RE.main()
        process.env.DMTPL_ENV = 'testing'
        expect(R).to.equal(true) // fails

    })

})
