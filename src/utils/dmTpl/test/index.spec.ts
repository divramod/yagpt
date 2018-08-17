// https://gitlab.com/divramod/dm-tpl/issues/7
import { describe, expect, it } from '@utils/dmTpl/test/export'
import { UTest as Utility } from './'

// TESTSUITE
describe(__filename, async () => {

    it('userInputCleanup(): 1 line', async () => {

        const U = Utility.getInstance()
        console.log('some very very very very very very long input') // tslint:disable-line:no-console
        const R = await U.userInputCleanup(1)
        expect(R).to.equal(true)

    })

    it('userInputCleanup(): 3 lines', async () => {

        const U = Utility.getInstance()
        console.log('some very very very very very very long input') // tslint:disable-line:no-console
        console.log('some very very very very very very long input') // tslint:disable-line:no-console
        console.log('some very very very very very very long input') // tslint:disable-line:no-console
        const R = await U.userInputCleanup(3)
        expect(R).to.equal(true)

    })

    it('contructor()', async () => {

        const U = Utility.getInstance()
        const U1 = new Utility()
        expect(true).to.equal(false)

    })

})
