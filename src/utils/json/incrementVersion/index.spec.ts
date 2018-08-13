// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

import { jsonIncrementVersion } from './'

const EXAMPLE_FILE_PATH = path.join(__dirname, '../../../../test-assets/exampleFiles')
const FILE_PATH_JSON_TPL =  path.join(EXAMPLE_FILE_PATH, 'project.json')
const FILE_PATH_JSON_NEW =  path.join(EXAMPLE_FILE_PATH, 'project_new.json')

describe('@utils/json/incrementVersion', () => {

    beforeEach( async () => {
        fs.copyFileSync(FILE_PATH_JSON_TPL, FILE_PATH_JSON_NEW)
    })

    afterEach( async () => {
        fs.unlinkSync(FILE_PATH_JSON_NEW)
    })

    it('should test user version update input', async () => {

        // read value before
        delete require.cache[FILE_PATH_JSON_NEW]
        const FILE_BEFORE = require(FILE_PATH_JSON_NEW)
        const VERSION_BEFORE = FILE_BEFORE.version
        expect(VERSION_BEFORE).to.equal('1.1.1-1')

        // change value
        process.env.DM_TPL_COMMANDS = 'j,ENTER'
        const RESULT = await jsonIncrementVersion(FILE_PATH_JSON_NEW, { release: '' })

        // read value after
        delete require.cache[FILE_PATH_JSON_NEW]
        const FILE_AFTER = require(FILE_PATH_JSON_NEW)
        const VERSION_AFTER = FILE_AFTER.version
        expect(VERSION_AFTER).to.equal('1.2.0')

    })

    it('should increment the patch version in a .json file', async () => {

        // read value before
        delete require.cache[FILE_PATH_JSON_NEW]
        const FILE_BEFORE = require(FILE_PATH_JSON_NEW)
        const VERSION_BEFORE = FILE_BEFORE.version
        expect(VERSION_BEFORE).to.equal('1.1.1-1')

        // change value
        const RESULT = jsonIncrementVersion(FILE_PATH_JSON_NEW, { release: 'patch' })

        // read value after
        delete require.cache[FILE_PATH_JSON_NEW]
        const FILE_AFTER = require(FILE_PATH_JSON_NEW)
        const VERSION_AFTER = FILE_AFTER.version
        expect(VERSION_AFTER).to.equal('1.1.1')
    })

    it('should increment the minor version in a .json file', async () => {

        // read value before
        delete require.cache[FILE_PATH_JSON_NEW]
        const FILE_BEFORE = require(FILE_PATH_JSON_NEW)
        const VERSION_BEFORE = FILE_BEFORE.version
        expect(VERSION_BEFORE).to.equal('1.1.1-1')

        // change value
        const RESULT = jsonIncrementVersion(FILE_PATH_JSON_NEW, { release: 'minor' })
        // const RESULT = jsonIncrementVersion(FILE_PATH_JSON_NEW, { release: '' })

        // read value after
        delete require.cache[FILE_PATH_JSON_NEW]
        const FILE_AFTER = require(FILE_PATH_JSON_NEW)
        const VERSION_AFTER = FILE_AFTER.version
        expect(VERSION_AFTER).to.equal('1.2.0')
    })

    it('should increment the major version in a .json file', async () => {

        // read value before
        delete require.cache[FILE_PATH_JSON_NEW]
        const FILE_BEFORE = require(FILE_PATH_JSON_NEW)
        const VERSION_BEFORE = FILE_BEFORE.version
        expect(VERSION_BEFORE).to.equal('1.1.1-1')

        // change value
        const RESULT = jsonIncrementVersion(FILE_PATH_JSON_NEW, { release: 'major' })

        // read value after
        delete require.cache[FILE_PATH_JSON_NEW]
        const FILE_AFTER = require(FILE_PATH_JSON_NEW)
        const VERSION_AFTER = FILE_AFTER.version
        expect(VERSION_AFTER).to.equal('2.0.0')
    })
})
