// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'
import { utils } from 'mocha'

import { gitBranchCheckout, gitBranchGetName } from '@utils/git/index'

const GIT_P = require('simple-git/promise')
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

utils.stackTraceFilter()
describe('@utils/git/gitBranchCheckout', async () => {

    it('should not checkout branch, when createRepoIfNotExistant: false is passed', async () => {

        // prepare directory and name
        const TEST_DIR = PATH.resolve('/tmp/test/dm-tpl')
        const BRANCH_NAME = 'test456'
        RIMRAF.sync(TEST_DIR)

        // run checkout
        // const R_GIT_BRANCH_CHECKOUT = await gitBranchCheckout({
        // branchName: BRANCH_NAME,
        // createRepoIfNotExistant: false,
        // inputCwdcwd: TEST_DIR,
        // })

        // TEST
        // expect(R_GIT_BRANCH_CHECKOUT.success).to.equal(false)
        // expect(R_GIT_BRANCH_CHECKOUT.messages[1]).to.equal('Branch ' + BRANCH_NAME + ' not checked out!')
        // expect(R_GIT_BRANCH_CHECKOUT.messages[0]).to
        // .equal('Repository ' + TEST_DIR + ' not existant. Creation aborted!')

        // remove TEST_DIR
        RIMRAF.sync(TEST_DIR)

    })

    it('should checkout branch with specified path and name when repo not existant { create: true }', async () => {

        // prepare directory and name
        const TEST_DIR = PATH.resolve('/tmp/test/dm-tpl')
        const BRANCH_NAME = 'test456'
        RIMRAF.sync(TEST_DIR)

        // run checkout
        // const R_GIT_BRANCH_CHECKOUT = await gitBranchCheckout({
        // branchName: BRANCH_NAME,
        // createRepoIfNotExistant: true,
        // inputCwdcwd: TEST_DIR,
            // })

            // TEST
            // expect(R_GIT_BRANCH_CHECKOUT.success).to.equal(true)
            // expect(R_GIT_BRANCH_CHECKOUT.msg).to.equal('Branch ' + BRANCH_NAME + ' checked out at ' + TEST_DIR + '!')
            // expect(R_GIT_BRANCH_CHECKOUT.msgCreateRepo)
            // .to.equal('Repository ' + TEST_DIR + ' not existant. Created it!')

            // remove TEST_DIR
            // RIMRAF.sync(TEST_DIR)

    })

})
