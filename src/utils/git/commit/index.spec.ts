// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'

const GIT_P = require('simple-git/promise')
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

import { gitCommit } from '@utils/git/index'

describe.only('@utils/git/commit', async () => {

    it('should commit when repo dirty (success: true)', async () => {

        // create /tmp/test directory
        const TEST_DIR = PATH.resolve('/tmp/test/dm-tpl')
        SHELL.mkdir('-p', TEST_DIR)

        // create git repo
        const GIT = GIT_P(TEST_DIR)
        const R_GIT_INIT = await GIT.init()

        // add file, so that the repo is not clean
        SHELL.touch(PATH.resolve(TEST_DIR, 'test.md'))

        // RUN
        // const R_GIT_COMMIT = await gitCommit({ cwd: TEST_DIR, testingA: { name: 'hello world' } })
        const R_GIT_COMMIT = await gitCommit({
            automaticCommit: false,
            cwd: TEST_DIR,
            testingA: { name: 'hello world' },
        })

        // TEST
        expect(R_GIT_COMMIT.success).to.equal(true)
        // expect(R_GIT_COMMIT.message).to.equal('Repository at ' + CWD + ' is clean. Nothing to commit!')
        // expect(R_GIT_COMMIT.message).to.equal('Repository at ' + CWD + ' is clean. Nothing to commit!')

        // FAIL
        expect(0).to.equal(1) // fails

        // remove TEST_DIR
        RIMRAF.sync(TEST_DIR)

    })

})
