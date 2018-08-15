// https://gitlab.com/divramod/dm-tpl/issues/4

// REQUIRE
const GIT_P = require('simple-git/promise')
const PATH = require('path')
const SHELL = require('shelljs')

// FUNCTIONS
import { gitBranchGetName } from '@utils/git/index'

// TYPINGS
import {
    IGitBranchCheckoutResults,
    IParamsGitBranchCheckout,
    IUtilsResult,
    IUtilsTaskResults,
    SUB_RESULT,
} from './index.typings'

/**
 * gitBranchCheckout(paramCwd, NAME)
 */
export async function gitBranchCheckout({
    paramCwd,
    paramBranchName,
    paramCreateRepositoryIfNotExistant = true,
    paramCreateBranchIfNotExistant = true,
}: IParamsGitBranchCheckout): Promise<IUtilsResult> {

    // FUNCTION RESULT
    const R: IUtilsResult = {
        results: {},
        success: false,
        value: '',
    }

    // TASKS RESULTS
    const R_TASKS: IGitBranchCheckoutResults = {
        branchCheckedOut: Object.assign({}, SUB_RESULT),
        branchCreated: Object.assign({}, SUB_RESULT),
        branchExistant: Object.assign({}, SUB_RESULT),
        repositoryCreated: Object.assign({}, SUB_RESULT),
        repositoryExistant: Object.assign({}, SUB_RESULT),
    }

    // createRepoIfNotExistant repo if not existant and options.createRepoIfNotExistant true
    const GIT = GIT_P(paramCwd)
    let REPOSITORY_EXISTANT = await GIT.checkIsRepo()
    if (!REPOSITORY_EXISTANT) {
        R_TASKS.repositoryExistant.value = true
        if (paramCreateRepositoryIfNotExistant) {
            const GIT_DIR = PATH.resolve(paramCwd)
            SHELL.mkdir('-p', GIT_DIR)
            const R_GIT_INIT = await GIT.init()
            REPOSITORY_EXISTANT = true
            // R.results.repoCreated = {
                // msg: 'Repository ' + paramCwd + ' not existant. Created it!',
                // success: true,
            // }
        } else {
            // R.results.repoCreated = {
                // msg: 'Repository ' + paramCwd + ' not existant. Creation aborted!',
                // success: false,
            // }
        }
    }

    // checkout branch, if repo existant
    if (REPOSITORY_EXISTANT) {
        const R_GIT_CHECKOUT = await GIT.raw([
            'checkout',
            '-b',
            paramBranchName,
        ])
        if (R_GIT_CHECKOUT === null) {
            // R.results.branchCheckedOut = {
                // msg: 'Branch ' + paramBranchName + ' checked out atparamCwdutCwd + '!',
                // success: true,
            // }
        } else {
            // R.results.branchCheckedOut = {
                // error: R_GIT_CHECKOUT,
                // msg: 'Branch ' + paramBranchName + ' not checked out atparamCwdutCwd + '!',
                // success: false,
            // }
        }
    } else {
        // R.results.branchCheckedOut = {
            // msg: 'Branch ' + paramBranchName + ' not checked out! Git RepositoryparamCwdutCwd + ' not existant!',
            // success: false,
        // }
    }

    R.results = R_TASKS

    // RETURN
    return R
}
