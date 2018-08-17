// https://gitlab.com///issues/
import { describe, expect, it } from '@utils/dmTpl/test/export'
import { run } from './run'

describe(__filename, async () => {

    it('run()', async () => {

        const R = await run()
        expect(R).to.equal(true) // passes

    })

})
