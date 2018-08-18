// https://gitlab.com/divramod/dm-tpl/issues/7
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UTest as U_INSTANCE, UTestUtility as U_CLASS } from './'

// TESTSUITE
describe(__filename, async () => {

    it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))
    it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    it('userInputCleanup(): 1 line', async () => {
        console.log('some very very very very very very long input') // tslint:disable-line:no-console
        const R = await U_INSTANCE.userInputCleanup(1)
        expect(R).to.equal(true)
    })

    it('userInputCleanup(): 3 lines', async () => {
        process.env.DMTPL_ENV = ''
        const R = await U_INSTANCE.userInputCleanup(3)
        expect(R).to.equal(false)
        process.env.DMTPL_ENV = 'testing'
    })

    it('getEnv()', async () => {
        const R = U_INSTANCE.getEnv()
        expect(R).to.equal('testing')
    })

})
