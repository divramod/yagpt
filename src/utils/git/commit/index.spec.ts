// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'
import { commit } from './'

describe('@utils/git/commit', async () => {

    it('should commit with update message', async () => {

        // TEST
        expect(1).to.equal(2) // fails
    })

    it('should commit with user input message and issue number', async () => {

        // TEST
        expect(0).to.equal(1) // fails
    })

})
