import { describe, expect, it } from '@utils/nodejs/test'
// import { main } from './'

describe.only(__filename, async () => {

    it([
        'main() env="testing"',
    ].join(' '), async () => {
        const RE = require('./')
        const R = await RE.main()
        expect(R).to.equal(false) // passes
    })

    it([
        'main() env="production"',
    ].join(' '), async () => {
        const RE = require('./')
        process.env.DMTPL_ENV = 'production'
        const R = await RE.main()
        process.env.DMTPL_ENV = 'testing'
        expect(R).to.equal(true) // fails
    })

})
