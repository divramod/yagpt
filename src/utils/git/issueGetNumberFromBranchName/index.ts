// https://gitlab.com/divramod/dm-tpl/issues/4
import { gitBranchGetName } from '@utils/git/branchGetName'

/**
 * gitIssueGetNumberFromBranchName()
 * [ ]
 */
export async function gitIssueGetNumberFromBranchName(PATH) {
    const BRANCH_NAME_COMPLETE = await gitBranchGetName(PATH)
    const BRANCH_NAME_COMPLETE_ARR = BRANCH_NAME_COMPLETE.split('/')
    const BRANCH_TYPE = BRANCH_NAME_COMPLETE_ARR[0]
    const BRANCH_NAME = BRANCH_NAME_COMPLETE_ARR[1]
    let issueNumber: any = ''
    if (BRANCH_NAME) {
        const BRANCH_NAME_ARR = BRANCH_NAME.split('-')
        issueNumber = parseInt(BRANCH_NAME_ARR[0], 10)
    }
    return issueNumber
}
