// https://gitlab.com/divramod/dm-tpl/issues/4
import { expect } from 'chai'
import 'mocha'
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

import { jsonChangeKeyValue } from './'

const EXAMPLE_FILE_PATH = path.join(__dirname, '../../../../test-assets/exampleFiles')
const FILE_PATH_JSON_TPL =  path.join(EXAMPLE_FILE_PATH, 'project.json')
const FILE_PATH_JSON_NEW =  path.join(EXAMPLE_FILE_PATH, 'project_new.json')

describe('@utils/json/changeKeyValue', () => {

    beforeEach( async () => {
        fs.copyFileSync(FILE_PATH_JSON_TPL, FILE_PATH_JSON_NEW)
    })

    afterEach( async () => {
        fs.unlinkSync(FILE_PATH_JSON_NEW)
    })

    it('should change the key value in a .json file', async () => {

        // read value before
        delete require.cache[FILE_PATH_JSON_NEW]
        const FILE_BEFORE = require(FILE_PATH_JSON_NEW)
        const NAME_BEFORE = FILE_BEFORE.name
        expect(NAME_BEFORE).to.equal('test')

        // change value
        const RESULT = jsonChangeKeyValue(FILE_PATH_JSON_NEW, 'name', 'new name')

        // read value after
        delete require.cache[FILE_PATH_JSON_NEW]
        const FILE_AFTER = require(FILE_PATH_JSON_NEW)
        const NAME_AFTER = FILE_AFTER.name
        expect(NAME_AFTER).to.equal('new name')
    })

})
