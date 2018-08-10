// https://gitlab.com/divramod/dm-tpl/issues/4

import { ask } from '@utils/prompt/ask'
import { jsonChangeKeyValue } from './../changeKeyValue'
const semver = require('semver')
const fs = require('fs')

const stdin = require('mock-stdin').stdin()

/**
 * jsonIncrementVersion()
 */
export async function jsonIncrementVersion(FILE_PATH, { release: RELEASE }) {
    delete require.cache[FILE_PATH]
    const FILE = require(FILE_PATH)
    const VERSION_BEFORE = FILE.version
    let NEW_VERSION = ''
    if (RELEASE) {
        NEW_VERSION = semver.inc(FILE.version, RELEASE)
    } else {
        const CHOICES = [ 'patch', 'minor', 'major' ]
        const QUESTIONS = [ { type: 'list', name: 'menu', message: '', choices: CHOICES } ]
        const answer = await ask(QUESTIONS)
        NEW_VERSION = semver.inc(FILE.version, answer.menu)
    }
    jsonChangeKeyValue(FILE_PATH, 'version', NEW_VERSION)
}
