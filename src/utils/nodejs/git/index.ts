// https://gitlab.com/divramod/yagpt/issues/4

// IMPORT
const GIT_P = require('simple-git/promise')
const gitBranchName = require('branch-name')
const SHELL = require('shelljs')
const PATH = require('path')
const _ = require('underscore')

// IMPORT
import { UCommon } from '@utils/nodejs/common'
import { UTest } from '@utils/nodejs/test'

// TYPINGS
import { IResult } from '@utils/nodejs/common'

// CLASS
export class UGitUtility {

    public static getInstance(): UGitUtility {
        return UGitUtility.INSTANCE
    }

    private static INSTANCE: UGitUtility = new UGitUtility()
    public name: string = 'UGitUtility'

    constructor() {
        if (UGitUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        UGitUtility.INSTANCE = this
    }

    /**
     * Checks, if the current branch is a feature branch. Feature branches.
     * start have the format feature/NO-NAME.
     * @param gitRepositoryPath  The Path of the Git repository to proof in.
     * @returns
     *      1. boolean(true)
     *      2. string "Error: Current branch is not a feature branch!"
     */
    public async checkIsFeatureBranch(
        gitRepositoryPath: string,
    ): Promise<boolean | string> {
        const R_CHECK_IS_REPO =
        await this.checkIsRepo(gitRepositoryPath)
        let result
        if (R_CHECK_IS_REPO === true) {
            const BRANCH_NAME = await this.getBranchName(gitRepositoryPath)
            if (BRANCH_NAME.indexOf('feature/') !== -1) {
                result = true
            } else {
                result = [
                    'Current Branch',
                    BRANCH_NAME,
                    'in',
                    gitRepositoryPath,
                    'is not a feature branch!',
                ].join(' ')
            }
        } else {
            result = R_CHECK_IS_REPO
        }
        return result
    }

    /**
     * Checks, if a given Path holds a git repository.
     * @param directoryPath  The Path to test in.
     * @returns
     *      1. boolean(true): Directory at path holds git repository.
     *      2. string("Error: `directoryPath` is not a git repository`!)
     *      3. string("Error: `directoryPath` not existant`!)
     */
    public async checkIsRepo(
        directoryPath: string,
    ): Promise<boolean | string> {
        let result
        if (SHELL.test('-d', directoryPath)) {
            const GIT = GIT_P(directoryPath)
            const CWD_BEFORE = process.cwd()
            process.chdir(directoryPath)
            const R_CHECK_IS_REPO = await GIT.checkIsRepo()
            process.chdir(CWD_BEFORE)
            if (R_CHECK_IS_REPO) {
                result = true
            } else {
                result = [
                    'Error:',
                    directoryPath,
                    'is not a git repository!',
                ].join(' ')
            }
        } else {
            result = [
                'Error:',
                directoryPath,
                'not existant!',
            ].join(' ')
        }
        return result
    }

    /**
     * Returns the name of the current branch of a git repository.
     * @param gitRepositoryPath  The path to the git repository.
     * @returns
     *      1. string(BRANCH_NAME)
     *      2. string("Error: `gitRepositoryPath` is not a git repository!")
     *      3. string("Error: `gitRepositoryPath` not existant!")
     */
    public async getBranchName(
        gitRepositoryPath,
    ): Promise<string> {
        let result
        const R_CHECK_IS_REPO = await this.checkIsRepo(gitRepositoryPath)
        if (R_CHECK_IS_REPO === true) {
            result = await gitBranchName.get({
                cwd: gitRepositoryPath,
            })
        } else {
            result = R_CHECK_IS_REPO
        }
        return result
    }

    /**
     * Removes all local branches from a git repository except master and
     * develop (default) or a passed string array with branch names.
     * @param gitRepositoryPath  Path of the repository from which the
     *  branches will be deleted.
     * @param excludedBranches  Branches to exclude from deletion.
     * @returns
     *      1. (suc) boolean: true
     *      2./3. (err) Errors from checkIsRepo
     */
    public async removeAllBranchesExcept(
        gitRepositoryPath: string,
        excludedBranches: string[] = [
            'master',
            'develop',
        ],
    ): Promise<boolean | string> {
        let result
        const R_CHECK_IS_REPO = await this.checkIsRepo(gitRepositoryPath)
        if (R_CHECK_IS_REPO === true) {
            const GIT = GIT_P(gitRepositoryPath)
            const BRANCHES_BEFORE_DELETE = await GIT.branch()
            const BRANCHES_TO_DELETE = []
            const CURRENT_BRANCH = BRANCHES_BEFORE_DELETE.current
            _.each(BRANCHES_BEFORE_DELETE.branches, (branch) => {
                if (branch.name.indexOf('remotes') !== 0) {
                    if (!_.contains(excludedBranches, branch.name)) {
                        BRANCHES_TO_DELETE.push(branch.name)
                    }
                }
            })
            _.each(BRANCHES_TO_DELETE, async (branch) => {
                await GIT.deleteLocalBranch(branch)
            })
            result = true
        } else {
            result = R_CHECK_IS_REPO
        }
        return result
    }

    /**
     * Checks if a branch exists in a git repository.
     * @param gitRepositoryPath  The path of the git repository.
     * @param branchName  The name of the branch to check for.
     * @returns
     *      1. boolean true: If the branch exists.
     *      2. string "Error: Branch `branchName` not existant!"
     */
    public async branchExistant(
        gitRepositoryPath,
        branchName,
    ): Promise<boolean | string> {
        let result
        const R_CHECK_IS_REPO = await this.checkIsRepo(gitRepositoryPath)
        if (R_CHECK_IS_REPO === true) {
            const GIT = GIT_P(gitRepositoryPath)
            const BRANCHES = await GIT.branch()
            if (_.contains(BRANCHES.all, branchName)) {
                result = true
            } else {
                result = [
                    'Error:',
                    'Branch',
                    branchName,
                    'not existant!',
                ].join(' ')
            }
        } else {
            result = R_CHECK_IS_REPO
        }
        return result
    }

    /**
     * Checks out a new branch at the given directory path.
     * @param gitRepositoryPath  The path of the git repository.
     * @param branchName  The name of the branch to check out.
     * @returns
     *      1. (suc) boolean(true)
     *      2. (err) string("Error: Branch already existant at
     *                      `gitRepositoryPath`!")
     */
    public async checkoutNewBranch(
        gitRepositoryPath,
        branchName,
    ): Promise <boolean | string> {
        let result
        const R_CHECK_IS_REPO = await this.checkIsRepo(gitRepositoryPath)
        if (R_CHECK_IS_REPO === true) {
            const BRANCH_EXISTANT = await this.branchExistant(
                gitRepositoryPath,
                branchName,
            )
            if (BRANCH_EXISTANT === true) {
                result = [
                    'Error:',
                    'Branch',
                    branchName,
                    'already existant at',
                    gitRepositoryPath,
                    '!',
                ].join(' ')
            } else {
                const GIT = GIT_P(gitRepositoryPath)
                await GIT.raw([
                    'checkout',
                    '-b',
                    branchName,
                ])
                result = true
            }
        } else {
            result = R_CHECK_IS_REPO
        }
        return result
    }

    /**
     * Checks out an existant branch!
     * @param gitRepositoryPath  The path of the git repository.
     * @param branchName  The name of the branch to check out.
     * @returns
     *      1. (suc) boolean(true)
     *      2. (err) string("Error: Branch not existant at
     *                      `gitRepositoryPath`!")
     */
    public async checkoutBranch(
        gitRepositoryPath,
        branchName,
    ): Promise <boolean | string> {
        let result
        const R_CHECK_IS_REPO = await this.checkIsRepo(gitRepositoryPath)
        if (R_CHECK_IS_REPO === true) {
            const BRANCH_EXISTANT = await this.branchExistant(
                gitRepositoryPath,
                branchName,
            )
            if (BRANCH_EXISTANT === true) {
                const GIT = GIT_P(gitRepositoryPath)
                await GIT.raw([
                    'checkout',
                    branchName,
                ])
                result = true
            } else {
                result = [
                    'Error:',
                    'Branch',
                    branchName,
                    'not existant at',
                    gitRepositoryPath,
                    '!',
                ].join(' ')
            }
        } else {
            result = R_CHECK_IS_REPO
        }
        return result
    }

    /**
     * Checks if a git repository is clean.
     * @param gitRepositoryPath  The path of the git repository.
     * @returns
     *      1. (suc) boolean(true)
     *      2. (err) string("Error: Repository not clean!'
     */
    public async checkIsClean(
        gitRepositoryPath,
    ): Promise <boolean | string> {
        let result
        const R_CHECK_IS_REPO =
        await this.checkIsRepo(gitRepositoryPath)
        if (R_CHECK_IS_REPO === true) {
            const GIT = GIT_P(gitRepositoryPath)
            const R = await GIT.status()
            if (R.files.length > 0) {
                result = [
                    'Repository at',
                    gitRepositoryPath,
                    'not clean!',
                ].join(' ')
            } else {
                result = true
            }
        } else {
            result = R_CHECK_IS_REPO
        }
        return result
    }

    /**
     * Returns the name of a feature branch.
     * @param gitRepositoryPath  The path of the git repository.
     * @returns
     *      1. (suc) string(FEATURE_NAME)
     *      2. (err) string("Error: `gitRepositoryPath`is not on a feature
     *                              branch!')
     */
    public async getFeatureName(
        gitRepositoryPath,
    ): Promise <boolean | string> {
        let result
        const R_CHECK_IS_REPO = await this.checkIsRepo(gitRepositoryPath)
        if (R_CHECK_IS_REPO === true) {
            const R_IS_FEATURE_BRANCH =
                await this.checkIsFeatureBranch(gitRepositoryPath)
            if (R_IS_FEATURE_BRANCH === true) {
                const BRANCH_NAME =
                    await this.getBranchName(gitRepositoryPath)
                const FEATURE_BRANCH_NAME =
                    BRANCH_NAME.substring(8, BRANCH_NAME.length)
                const FEATURE_NAME =
                    FEATURE_BRANCH_NAME.substring(
                        FEATURE_BRANCH_NAME.indexOf('-') + 1,
                        FEATURE_BRANCH_NAME.length,
                    )
                result = FEATURE_NAME
            } else {
                result = R_IS_FEATURE_BRANCH
            }
        } else {
            result = R_CHECK_IS_REPO
        }
        return result
    }

    /**
     * Returns the number of a feature from a feature branch.
     * @param gitRepositoryPath  The path of the git repository.
     * @returns
     *      1. (suc) string(FEATURE_NAME)
     *      2. (err) string("Error: `gitRepositoryPath`is not on a feature
     *                              branch!')
     */
    public async getFeatureIssueNumber(
        gitRepositoryPath,
    ): Promise <boolean | string> {
        let result
        const R_CHECK_IS_REPO = await this.checkIsRepo(gitRepositoryPath)
        if (R_CHECK_IS_REPO === true) {
            const R_IS_FEATURE_BRANCH =
                await this.checkIsFeatureBranch(gitRepositoryPath)
            if (R_IS_FEATURE_BRANCH === true) {
                const BRANCH_NAME =
                    await this.getBranchName(gitRepositoryPath)
                const FEATURE_BRANCH_NAME =
                    BRANCH_NAME.substring(8, BRANCH_NAME.length)
                const ISSUE_NUMBER =
                    Number(FEATURE_BRANCH_NAME.substring(
                        0,
                        FEATURE_BRANCH_NAME.indexOf('-'),
                    ))
                result = ISSUE_NUMBER
            } else {
                result = R_IS_FEATURE_BRANCH
            }
        } else {
            result = R_CHECK_IS_REPO
        }
        return result
    }

    /**
     * Checks, if a branch is mergable into the current one.
     * @param gitRepositoryPath  The path of the git repository.
     * @param branchName  The name of the branch to check out.
     * @returns
     *      1. boolean true
     *      2. string Error: Branch `branchName` not mergable!
     */
    public async checkIsMergable(
        gitRepositoryPath: string,
        branchName: string,
    ): Promise <boolean | string> {
        const GIT = GIT_P(gitRepositoryPath)
        let result
        const R_FETCH = await GIT.raw([
            'fetch',
            'origin',
            branchName,
        ])
        const PATH_BEFORE = process.cwd()
        SHELL.cd(gitRepositoryPath)
        const BRANCH_FULL_NAME  = 'origin/' + branchName
        const R_MERGABLE = await GIT.raw([
            'merge',
            '--no-commit',
            '--no-ff',
            BRANCH_FULL_NAME,
        ])
        if (
            R_MERGABLE === null ||
            R_MERGABLE.indexOf('Already up-to-date.') > -1
        ) {
            result = true
        } else {
            result = [
                'Error:',
                branchName,
                'not mergable',
            ].join(' ')
        }
        const R_RESET_HARD = await GIT.raw([
            'reset',
            '--hard',
            'ORIG_HEAD',
        ])
        SHELL.cd(PATH_BEFORE)
        return result
    }
}
export const UGit = UGitUtility.getInstance()
