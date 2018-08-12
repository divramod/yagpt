// https://gitlab.com///issues/
import { expect } from 'chai'
import 'mocha'
import { gitIssueGetNumberFromBranchName } from './'
const git = require('simple-git/promise')
const path = require('path')
const shell = require('shelljs')
const rimraf = require('rimraf')

describe('@utils/git/getIssueNumberFromBranchName', async () => {

    it('should return issue number when branch name has format "feature/003-test"', async () => {
        // create /tmp/test directory
        const TEST_DIR = path.resolve('/tmp/test/dm-tpl')
        rimraf.sync(TEST_DIR)
        shell.mkdir('-p', TEST_DIR)

        // create git repo and checkout misc branch name
        const R_GIT_INIT = await git(TEST_DIR).init()
        const R_GIT_CHECKOUT = await git(TEST_DIR).raw([
            'checkout',
            '-b',
            'feature/003-test',
        ])

        // test
        const ISSUE_NUMBER = await gitIssueGetNumberFromBranchName(TEST_DIR)
        expect(ISSUE_NUMBER).to.equal(3)

        // clean up
        rimraf.sync(TEST_DIR)
    })

    it('should return empty string when branch type is not feature', async () => {
        // create /tmp/test directory
        const TEST_DIR = path.resolve('/tmp/test/dm-tpl')
        rimraf.sync(TEST_DIR)
        shell.mkdir('-p', TEST_DIR)

        // create git repo and checkout misc branch name
        const R_GIT_INIT = await git(TEST_DIR).init()
        // const R_GIT_CHECKOUT = await git().checkoutBranch('test123')
        const R_GIT_CHECKOUT = await git(TEST_DIR).raw([
            'checkout',
            '-b',
            'test123',
        ])

        // test
        const BRANCH_NAME = await gitIssueGetNumberFromBranchName(TEST_DIR)
        expect(BRANCH_NAME).to.equal('')

        // remove TEST_DIR
        rimraf.sync(TEST_DIR)
    })

    it('should return empty string when no git repo', async () => {
        // create /tmp/test directory
        const TEST_DIR = path.resolve('/tmp/test/dm-tpl')
        rimraf.sync(TEST_DIR)
        shell.mkdir('-p', TEST_DIR)

        // test
        const BRANCH_NAME = await gitIssueGetNumberFromBranchName(TEST_DIR)
        expect(BRANCH_NAME).to.equal('')
    })

})
