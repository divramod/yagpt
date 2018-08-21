// https://gitlab.com/divramod/dm-tpl/issues/4
import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UGit as U_INSTANCE, UGitUtility as U_CLASS } from './'

// TESTSUITE
describe(__filename, async () => {

    it('getInstance()', UTest.utilityTestGetInstance(U_CLASS, U_INSTANCE))

    it('constructor()', UTest.utilityTestConstructor(U_CLASS))

    it('init()', async () => {

        const R = await U_INSTANCE.init(__dirname)
        expect(R).to.equal(true)

    })

    it('getRepositoryPath()', async () => {

        const R_INIT = await U_INSTANCE.init(__dirname)
        expect(R_INIT).to.equal(true)

        const R_GET_REPOSITORY_PATH = await U_INSTANCE.getRepositoryPath()
        expect(R_GET_REPOSITORY_PATH).to.equal(__dirname)

    })

    it('setRepositoryPath()', async () => {

        const R = U_INSTANCE.setRepositoryPath(__dirname)
        const R_GET_REPOSITORY_PATH = U_INSTANCE.getRepositoryPath()
        expect(R_GET_REPOSITORY_PATH).to.equal(__dirname)

    })

    it('getBranchName()', async () => {

        const R = await U_INSTANCE.getBranchName()
        expect(R).to.equal(false)

    })

    it('isFeatureBranch()', async () => {

        const R = await U_INSTANCE.isFeatureBranch()
        expect(R).to.equal(false)

    })

})
