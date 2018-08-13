// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'

import { gitRepoClean } from './'

const GIT_P = require('simple-git/promise')
const PATH = require('path')
const SHELL = require('shelljs')
const RIMRAF = require('rimraf')

describe('@utils/git/repoClean', async () => {

    it('should state that the repo is clean', async () => {

        // create /tmp/test directory
        const TEST_DIR = PATH.resolve('/tmp/test/dm-tpl')
        SHELL.mkdir('-p', TEST_DIR)

        // create git repo
        const GIT = GIT_P(TEST_DIR)
        const R_GIT_INIT = await GIT.init()

        // run
        const R_RUN = await gitRepoClean(TEST_DIR)

        // TEST
        expect(R_RUN).to.equal(true)

        // remove TEST_DIR
        RIMRAF.sync(TEST_DIR)

    })

    it('should state that the repo is not clean', async () => {

        // create /tmp/test directory
        const TEST_DIR = PATH.resolve('/tmp/test/dm-tpl')
        SHELL.mkdir('-p', TEST_DIR)

        // create git repo
        const GIT = GIT_P(TEST_DIR)
        const R_GIT_INIT = await GIT.init()

        // add file, so that the repo is not clean
        SHELL.touch(PATH.resolve(TEST_DIR, 'test.md'))

        // run
        const R_RUN = await gitRepoClean(TEST_DIR)

        // TEST
        expect(R_RUN).to.equal(false)

        // remove TEST_DIR
        RIMRAF.sync(TEST_DIR)

    })

})
