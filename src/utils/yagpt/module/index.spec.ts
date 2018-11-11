import { UConfig } from '@utils/yagpt/config'
import { describe, expect, it, UTest } from '@utils/yagpt/test'
import { UModule as U_INSTANCE } from './'
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

describe(__filename, async () => {

    beforeEach(async () => {
        RIMRAF.sync(UConfig.testPath)
    })

    afterEach(async () => {
        RIMRAF.sync(UConfig.testPath)
    })

})
