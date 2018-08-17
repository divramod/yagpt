// https://gitlab.com/divramod/dm-tpl/issues/7
import { describe, expect, it } from '@utils/dmTpl/test/export'
import { UTest as Utility } from './'

// TESTSUITE
describe(__filename, async () => {

    it('getInstance()', async () => {

        const U = Utility.getInstance()
        const U1 = Utility.getInstance()
        expect(U).to.deep.equal(U1)

    })

    it('contructor()', async () => {

        try {
            const U = new Utility()
        } catch (e) {
            expect(e.message).to.equal('Error: Instantiation failed: Use UTest.getInstance() instead of new.')
        }

    })

    it('userInputCleanup(): 1 line', async () => {

        const U = Utility.getInstance()
        console.log('some very very very very very very long input') // tslint:disable-line:no-console
        const R = await U.userInputCleanup(1)
        expect(R).to.equal(true)

    })

    it('userInputCleanup(): 3 lines', async () => {

        process.env.DMTPL_ENV = ''
        const U = Utility.getInstance()
        const R = await U.userInputCleanup(3)
        expect(R).to.equal(false)

    })

    it('getEnv()', async () => {

        const U = Utility.getInstance()
        const R = U.getEnv()
        expect(R).to.equal('testing')

    })

})
