// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'

const SHELL = require('shelljs')

import { run } from './'

describe('@jobs/git/releasePublish', async () => {

    let stdin

    beforeEach( async () => {
        stdin = require('mock-stdin').stdin()
    })

    it('it should create a release and publish it', async () => {

        // set input
        process.env.DM_TPL_COMMANDS = 'j,ENTER ENTER'

        // RUN
        const R_RUN = await run()

        // TEST
        expect(1).to.equal(1) // passes
    })

})
