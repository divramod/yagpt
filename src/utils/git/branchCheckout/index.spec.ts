// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'

import { gitBranchCheckout, gitBranchGetName } from '@utils/index'

const gitP = require('simple-git/promise')
const path = require('path')
const rimraf = require('rimraf')
const shell = require('shelljs')

describe('@utils/git/gitBranchCheckout', async () => {

    it('should not checkout branch, when { checked: false } is passed', async () => {

        // prepare directory and name
        const TEST_DIR = path.resolve('/tmp/test/dm-tpl')
        const REPO_NAME = 'test456'
        rimraf.sync(TEST_DIR)

        // run checkout
        const R_GIT_BRANCH_CHECKOUT = await gitBranchCheckout(TEST_DIR, REPO_NAME, { create: false })

        // TEST
        expect(R_GIT_BRANCH_CHECKOUT.success).to.equal(false)
        expect(R_GIT_BRANCH_CHECKOUT.msg).to.equal('Branch ' + REPO_NAME + ' not checked out!')
        expect(R_GIT_BRANCH_CHECKOUT.msgCreateRepo).to
            .equal('Repository ' + TEST_DIR + ' not existant. Creation aborted!')

        // remove TEST_DIR
        rimraf.sync(TEST_DIR)

    })

    it('should checkout branch with specified path and name when repo not existant { create: true }', async () => {

        // prepare directory and name
        const TEST_DIR = path.resolve('/tmp/test/dm-tpl')
        const REPO_NAME = 'test456'
        rimraf.sync(TEST_DIR)

        // run checkout
        const R_GIT_BRANCH_CHECKOUT = await gitBranchCheckout(TEST_DIR, REPO_NAME, { create: true })

        // TEST
        expect(R_GIT_BRANCH_CHECKOUT.success).to.equal(true)
        expect(R_GIT_BRANCH_CHECKOUT.msg).to.equal('Branch ' + REPO_NAME + ' checked out at ' + TEST_DIR + '!')
        expect(R_GIT_BRANCH_CHECKOUT.msgCreateRepo)
            .to.equal('Repository ' + TEST_DIR + ' not existant. Created it!')

        // remove TEST_DIR
        rimraf.sync(TEST_DIR)

    })

})
