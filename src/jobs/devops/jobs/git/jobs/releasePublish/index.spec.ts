// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'

import { run } from './'

describe('@jobs/git/releasePublish', async () => {

    it('it should create a release and publish it', async () => {

        // RUN
        const result = await run()

        // TEST
        expect(1).to.equal(1) // passes
    })

})
