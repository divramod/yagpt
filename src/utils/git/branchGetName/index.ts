// https://gitlab.com/divramod/dm-tpl/issues/4
const branchName = require('branch-name')

/**
 * gitBranchGetName(cwd)
 * [ ]
 */
export async function gitBranchGetName(PATH) {
    let branchNameComplete
    try {
        branchNameComplete = await branchName.get({ cwd: PATH })
    } catch (e) {
        branchNameComplete = ''
    }
    return branchNameComplete
}
