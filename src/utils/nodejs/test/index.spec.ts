// https://gitlab.com/divramod/dm-tpl/issues/7

// IMPORT
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UTest as U_INSTANCE, UTestUtility as U_CLASS } from './'

// TESTSUITE
describe(__filename, async () => {

    it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))
    it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    it('userInputCleanup(): 1 line', async () => {
        console.log([ // tslint:disable-line:no-console
            'some very very very very very very long input',
        ].join())
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

    it('createTestDirectory(): success false (wrong path)', async () => {
        const DIRECTORY_PATH = '/bla'
        const R = await U_INSTANCE.createTestDirectory({
            bDeleteIfDirectoryExistant: true,
            directoryPath: DIRECTORY_PATH,
        })
        expect(R.success).to.equal(false)
        expect(R.message).to.equal([
            'You can\'t use the directory',
            DIRECTORY_PATH,
            'for testing purposes! Please use a subdirectory of \'/tmp/test\'!',
        ].join(' '))
    })

    it([
        'createTestDirectory():',
        'success true (right path, deleteIfExistant=true)',
    ].join(' '), async () => {
        const DIRECTORY_PATH = '/tmp/test/nodejs/test'
        const R = await U_INSTANCE.createTestDirectory({
            bDeleteIfDirectoryExistant: true,
            directoryPath: DIRECTORY_PATH,
        })
        expect(R.success).to.equal(true)
        expect(R.message).to.equal([
            'Directory',
            DIRECTORY_PATH,
            'removed and created',
        ].join(' '))
    })

})
