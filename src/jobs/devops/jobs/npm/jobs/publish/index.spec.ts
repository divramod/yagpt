// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'

describe(__filename, () => {

    describe.only('without path', () => {

        it('should publish the npm module in which i am located', async () => {
            // fail
            expect(1).to.equal(2)
        })

    })

    describe('with path', () => {

        it('should publish the npm module at path', async () => {
            // fail
            expect(1).to.equal(2)
        })

    })

})
