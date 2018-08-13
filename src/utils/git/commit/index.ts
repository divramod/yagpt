// https://gitlab.com/divramod/dm-tpl/issues/4

// REQUIRE
const gitP = require('simple-git/promise')

// FUNCTIONS
import { gitRepoClean } from '@utils/git/index'
import { promptAskYesNo } from '@utils/prompt/index'

// TYPINGS
import { IUtilsResult } from '@typings/utils/index'

interface IGitCommitTesting {
    parameters?: string;
    name?: string;
}

interface IGitCommit {
    cwd: string;
    automaticCommit?: boolean;
    testing?: IGitCommitTesting;
    testingA?: IGitCommitTesting;
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
    testing,
}: IGitCommit) {

    if (automaticCommit) {
        console.log('automaticCommit', automaticCommit) // tslint:disable-line:no-console
    }
    if (testing) {
        console.log('testing', testing) // tslint:disable-line:no-console
    }
    console.log('cwd', cwd) // tslint:disable-line:no-console
    const UTILS_RESULT: IUtilsResult = {
        message: '',
        success: false,
        value: '',
    }
    console.log('gitCommit') // tslint:disable-line:no-console
    const git = gitP(cwd)

    // check if directory dirty
    const R_REPO_CLEAN = await gitRepoClean(cwd)
    if (R_REPO_CLEAN) {
        console.log('repo clean') // tslint:disable-line:no-console
        UTILS_RESULT.message = 'Repository at ' + cwd + ' is clean. Nothing to commit!'
    } else {
        UTILS_RESULT.message = 'Repository at ' + cwd + ' was not clean. Committed changes!'
        console.log('repo not clean') // tslint:disable-line:no-console
    }
    return UTILS_RESULT
}
