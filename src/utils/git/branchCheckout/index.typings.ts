// IMPORT
import { IUtilsResult, IUtilsSubResult, IUtilsTaskResults } from '@typings/utils/index'
export { IUtilsResult, IUtilsSubResult, IUtilsTaskResults } from '@typings/utils/index'

//
export interface IGitBranchCheckoutResults extends IUtilsTaskResults {
    repositoryExistant: IUtilsSubResult;
    repositoryCreated: IUtilsSubResult;
    branchExistant: IUtilsSubResult;
    branchCreated: IUtilsSubResult;
    branchCheckedOut: IUtilsSubResult;
}

//
export interface IParamsGitBranchCheckout {
    paramCwd: string; // proof if not existant
    paramBranchName: string; // proof if not existant
    paramCreateRepositoryIfNotExistant: boolean;
    paramCreateBranchIfNotExistant: boolean;
}

export const SUB_RESULT: IUtilsSubResult = {
    error: undefined,
    msg: undefined,
    success: undefined,
    value: undefined,
}
