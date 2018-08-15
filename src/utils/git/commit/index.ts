// https://gitlab.com/divramod/dm-tpl/issues/4

// REQUIRE
const gitP = require('simple-git/promise')

// FUNCTIONS
import { gitRepoClean } from '@utils/git/index'
import { promptAskYesNo } from '@utils/prompt/index'

// TYPINGS
import { IUtilsResult } from '@typings/utils/index'

interface IGitCommitTesting {
    execute: boolean;
    params?: any;
}

interface IGitCommitInput {
    cwd: string;
    automaticCommit?: boolean;
    testing?: IGitCommitTesting;
}

/**
 * gitCommit(CWD)
 * DONE: check if directory dirty
 * TODO: create utils result type
 * TODO: if repo clean return result
 * TODO: if repo not clean, ask if user wants to commit changes
 * TODO: if user does not to want to commit return
 */
export async function gitCommit({
    cwd,
    automaticCommit = false,
    testing = { execute: false },
}: IGitCommitInput): Promise<IUtilsResult> {

    // FUNCTION RESULT
    const R: IUtilsResult = {
        results: {},
        success: false,
        value: '',
    }

    // TASKS RESULTS
    // const R_TASKS: IGitCommitResults = {
        // branchCheckedOut: Object.assign({}, SUB_RESULT),
        // branchCreated: Object.assign({}, SUB_RESULT),
        // branchExistant: Object.assign({}, SUB_RESULT),
        // repositoryCreated: Object.assign({}, SUB_RESULT),
        // repositoryExistant: Object.assign({}, SUB_RESULT),
    // }

    // check if directory dirty
    const R_REPO_CLEAN = await gitRepoClean(cwd)
    if (R_REPO_CLEAN) {
        console.log('repo clean') // tslint:disable-line:no-console
        // R.message = 'Repository at ' + cwd + ' is clean. Nothing to commit!'
    } else {
        // R.message = 'Repository at ' + cwd + ' was not clean. Committed changes!'
        console.log('repo not clean') // tslint:disable-line:no-console
    }
    return R
}
