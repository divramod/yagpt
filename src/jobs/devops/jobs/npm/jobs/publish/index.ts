// https://gitlab.com/divramod/dm-tpl/issues/4
const path = require('path')
import { jsonIncrementVersion } from '@utils/json/incrementVersion'
const shell = require('shelljs')

export async function run() {
    const JOB_NAME = 'publish'
    console.log('JOB_NAME: ', JOB_NAME) // tslint:disable-line:no-console
    let currentPath = shell.pwd()
    currentPath = currentPath.toString()
    console.log('currentPath', currentPath) // tslint:disable-line:no-console

    // increment version
    await jsonIncrementVersion(path.join(currentPath, 'package.json'), { release: 'patch' })

    // TODO: ask for issue number
    // TODO: git commit
    // TODO: git push
    // TODO: git tag
    // TODO: npm publish
}
