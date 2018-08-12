// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'
import { gitBranchGetName } from './'

const path = require('path')
const fs = require('fs')
const gitP = require('simple-git/promise')
const rimraf = require('rimraf')
const shell = require('shelljs')

describe('@utils/git/getBranchName', async () => {

    it('should get a branch name', async () => {
        // create /tmp/test directory
        const TEST_DIR = path.resolve('/tmp/test/dm-tpl')
        shell.mkdir('-p', TEST_DIR)

        // create git repo
        const git = gitP(TEST_DIR)
        const R_GIT_INIT = await git.init()

        // test if branchname = master
        const BRANCH_NAME = await gitBranchGetName(TEST_DIR)
        expect(BRANCH_NAME).to.equal('master')

        // remove TEST_DIR
        rimraf.sync(TEST_DIR)

    })

    it('should fail: no repo in path', async () => {
        const TEST_DIR = path.resolve('/tmp/test/dm-tpl')
        const BRANCH_NAME = await gitBranchGetName(TEST_DIR)
        expect(BRANCH_NAME).to.equal('')
    })

    it('should fail: path not existant', async () => {
        const TEST_DIR = path.resolve('/tmp/test/dm-tpl/asdlkfjasldkjfalsdkfj')
        const BRANCH_NAME = await gitBranchGetName(TEST_DIR)
        expect(BRANCH_NAME).to.equal('')
    })

})
