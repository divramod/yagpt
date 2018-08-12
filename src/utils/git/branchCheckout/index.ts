// https://gitlab.com/divramod/dm-tpl/issues/4

const gitP = require('simple-git/promise')
const path = require('path')
const shell = require('shelljs')

/**
 * gitBranchCheckout(PATH, NAME)
 * [ ]
 */
export async function gitBranchCheckout(PATH, NAME, { create } ) {

    // construct result
    const MSG_CREATE_REPO = 'Repository ' + NAME + ' was existant!'
    const result = {
        msg: '',
        msgCreateRepo: MSG_CREATE_REPO,
        success: false,
    }

    // create directory if not existant
    const GIT_DIR = path.resolve(PATH)
    shell.mkdir('-p', GIT_DIR)

    // construct git
    const git = gitP(GIT_DIR)

    // create repo if not existant and options.create true
    let GIT_REPO_EXISTANT = await git.checkIsRepo()
    if (!GIT_REPO_EXISTANT) {
        if (create) {
            const R_GIT_INIT = await git.init()
            GIT_REPO_EXISTANT = true
            result.msgCreateRepo = 'Repository ' + PATH + ' not existant. Created it!'
        } else {
            result.msgCreateRepo = 'Repository ' + PATH + ' not existant. Creation aborted!'
        }
    }

    // checkout branch, if repo existant
    if (GIT_REPO_EXISTANT) {
        const R_GIT_CHECKOUT = await git.raw([
            'checkout',
            '-b',
            NAME,
        ])
        if (R_GIT_CHECKOUT === null) {
            result.success = true
        }
        result.msg = 'Branch ' + NAME + ' checked out at ' + PATH + '!'
    } else {
        result.msg = 'Branch ' + NAME + ' not checked out!'
    }

    // RETURN
    return result
}
