// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'

const SHELL = require('shelljs')

import { run } from './'

describe.skip('@jobs/git/releasePublish', async () => {

    it('it should create a release and publish it', async () => {

        // set input
        process.env.DM_TPL_COMMANDS = 'ENTER'

        // RUN
        const R_RUN = await run()

        // TEST
        expect(0).to.equal(1) // fails
    })

})
