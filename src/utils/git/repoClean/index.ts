// https://gitlab.com/divramod/dm-tpl/issues/4

const GIT_P = require('simple-git/promise')

/**
 * gitRepoClean()
 * [ ]
 */
export async function gitRepoClean(CWD) {
    const GIT = GIT_P(CWD)
    let repoClean = true
    const R_GIT_STATUS = await GIT.status()
    if (R_GIT_STATUS.files.length > 0) {
        repoClean = false
    }
    return repoClean
}
