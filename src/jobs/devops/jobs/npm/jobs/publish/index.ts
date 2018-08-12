// https://gitlab.com/divramod/dm-tpl/issues/4
const path = require('path')
const shell = require('shelljs')

import { gitIssueGetNumberFromBranchName } from '@utils/git/issueGetNumberFromBranchName'
import { jsonIncrementVersion } from '@utils/json/incrementVersion'

export async function run() {
    const JOB_NAME = 'publish'
    let currentPath = shell.pwd()
    currentPath = currentPath.toString()

    // increment version
    // await jsonIncrementVersion(path.join(currentPath, 'package.json'), { release: 'patch' })

    // ask for issue number / no, choose from branch name
    const ISSUE_NUMBER = await gitIssueGetNumberFromBranchName(currentPath)

    // TODO: git: commit current changes (to feature)

    // TODO: git: merge feature into develop (when existant)

    // TODO: job: devops.git.release

    // TODO: npm: publish
}
