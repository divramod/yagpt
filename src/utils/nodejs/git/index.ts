// https://gitlab.com/divramod/yagpt/issues/4

// IMPORT
const GIT_P = require('simple-git/promise')
const branchName = require('branch-name')
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

    public async checkIsFeatureBranch(
        GIT_REPOSITORY_PATH: string,
    ): Promise<IResult> {

        // RESULT
        const RESULT: IResult = {
            error: undefined,
            message: undefined,
            value: undefined,
        }

        const R_CHECK_IS_REPO =
        await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const BRANCH_NAME = await this.getBranchName(GIT_REPOSITORY_PATH)
            if (BRANCH_NAME.indexOf('feature/') !== -1) {
                RESULT.value = true
                RESULT.message = 'Is on a Feature Branch'
            } else {
                RESULT.value = false
                RESULT.message = 'Is not a Feature Branch'
            }
        } else {
            RESULT.value = false
            RESULT.message = 'No Git Repository at path ' + GIT_REPOSITORY_PATH
        }
        return RESULT
    }

    public async checkIsRepo(
        DIRECTORY_PATH,
    ): Promise<IResult> {
        // RESULT
        const RESULT: IResult = UCommon.getResultObjectOne()

        if (SHELL.test('-d', DIRECTORY_PATH)) {
            const GIT = GIT_P(DIRECTORY_PATH)
            const CWD_BEFORE = process.cwd()
            process.chdir(DIRECTORY_PATH)
            const R_CHECK_IS_REPO = await GIT.checkIsRepo()
            process.chdir(CWD_BEFORE)
            if (R_CHECK_IS_REPO) {
                RESULT.value = true
                RESULT.message = [
                    DIRECTORY_PATH,
                    'is a git repository!',
                ].join(' ')
            } else {
                RESULT.value = false
                RESULT.message = [
                    DIRECTORY_PATH,
                    'is not a git repository!',
                ].join(' ')
            }
        } else {
            RESULT.value = false
            RESULT.message = [
                DIRECTORY_PATH,
                'not existant!',
            ].join(' ')
        }

        return RESULT
    }

    public async getBranchName(GIT_REPOSITORY_PATH): Promise<string> {
        let result
        const R_CHECK_IS_REPO =
        await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            result = await branchName.get({
                cwd: GIT_REPOSITORY_PATH,
            })
        }
        return result
    }

    /**
     * Removes all local branches from a git repository except master and
     * develop (default) or a passed string array with branch names.
     * @maintainer Arvid Petermann
     * @param gitRepositoryPath  Path of the repository from which the
     *  branches will be deleted.
     * @param excludedBranches  Branches to exclude from deletion.
     * @returns
     *      1. (suc) boolean: true
     *      2. (err) string: "error: `gitRepositoryPath` is not a Git
     *                        Repository!"
     */
    public async removeAllBranchesExceptMasterAndDevelop(
        gitRepositoryPath: string,
        excludedBranches: string[] = [
            'master',
            'develop',
        ],
    ): Promise<boolean | string> {
        let result
        const R_CHECK_IS_REPO = await this.checkIsRepo(gitRepositoryPath)
        if (R_CHECK_IS_REPO.value) {
            const GIT = GIT_P(gitRepositoryPath)
            const BRANCHES_BEFORE_DELETE = await GIT.branch()
            const CURRENT_BRANCH = BRANCHES_BEFORE_DELETE.current
            _.each(BRANCHES_BEFORE_DELETE.branches, async (branch) => {
                if (!_.contains(excludedBranches, branch.name)) {
                    if (branch.name.indexOf('remotes') !== 0) {
                        await GIT.deleteLocalBranch(branch.name)
                    }
                }
            })
            result = true
        } else {
            result = [
                'error:',
                gitRepositoryPath,
                'is not a Git Repository!',
            ].join(' ')
        }
        return result
    }

    public async checkoutBranch(
        GIT_REPOSITORY_PATH,
        BRANCH_NAME,
    ): Promise < boolean > {
        let result = false
        const R_CHECK_IS_REPO =
        await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const GIT = GIT_P(GIT_REPOSITORY_PATH)
            await GIT.raw([
                'checkout',
                '-b',
                BRANCH_NAME,
            ])
            result = true
        }

        return result
    }

    public async checkout(
        GIT_REPOSITORY_PATH,
        BRANCH_NAME,
    ): Promise < boolean > {
        let result = false
        const R_CHECK_IS_REPO =
        await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const GIT = GIT_P(GIT_REPOSITORY_PATH)
            await GIT.raw([
                'checkout',
                BRANCH_NAME,
            ])
            result = true
        }

        return result
    }

    public async checkIsClean(
        GIT_REPOSITORY_PATH,
    ): Promise < boolean > {
        let result = true
        const R_CHECK_IS_REPO =
        await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const GIT = GIT_P(GIT_REPOSITORY_PATH)
            const R = await GIT.status()
            if (R.files.length > 0) {
                result = false
            }
        }
        return result
    }

    /**
     *  params:
     *      GIT_REPOSITORY_PATH: path of the repository
     *  return: Promise<IResult>
     *      value: Feature Name | undefined
     *      message: ...
     */
    public async getFeatureName(
        GIT_REPOSITORY_PATH,
    ): Promise < IResult > {
        const RESULT: IResult = UCommon.getResultObjectMultiple()
        const R_CHECK_IS_REPO =
        await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const R_IS_FEATURE_BRANCH =
                await this.checkIsFeatureBranch(GIT_REPOSITORY_PATH)
            if (R_IS_FEATURE_BRANCH.value) {
                const BRANCH_NAME =
                    await this.getBranchName(GIT_REPOSITORY_PATH)
                const FEATURE_BRANCH_NAME =
                    BRANCH_NAME.substring(8, BRANCH_NAME.length)
                const FEATURE_NAME =
                    FEATURE_BRANCH_NAME.substring(
                        FEATURE_BRANCH_NAME.indexOf('-') + 1,
                        FEATURE_BRANCH_NAME.length,
                    )
                RESULT.value = FEATURE_NAME
                RESULT.message = [
                    GIT_REPOSITORY_PATH,
                    'branch name is',
                    FEATURE_NAME,
                ].join(' ')
            } else {
                RESULT.message = [
                    GIT_REPOSITORY_PATH,
                    'is not on a feature Branch!',
                ].join(' ')
            }
        } else {
            RESULT.message = [
                GIT_REPOSITORY_PATH,
                'is not a git repository!',
            ].join(' ')
        }
        return RESULT
    }

    /**
     * params:
     *      GIT_REPOSITORY_PATH: path of the Repository
     * return: Promise<IResult>
     *      value: Feature Issue Number | undefined
     *      message: Success Message
     */
    public async getFeatureIssueNumber(
        GIT_REPOSITORY_PATH,
    ): Promise < IResult > {
        const RESULT: IResult = UCommon.getResultObjectMultiple()
        const R_CHECK_IS_REPO =
        await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const R_IS_FEATURE_BRANCH =
                await this.checkIsFeatureBranch(GIT_REPOSITORY_PATH)
            if (R_IS_FEATURE_BRANCH.value) {
                const BRANCH_NAME =
                    await this.getBranchName(GIT_REPOSITORY_PATH)
                const FEATURE_BRANCH_NAME =
                    BRANCH_NAME.substring(8, BRANCH_NAME.length)
                const ISSUE_NUMBER =
                    Number(FEATURE_BRANCH_NAME.substring(
                        0,
                        FEATURE_BRANCH_NAME.indexOf('-'),
                    ))
                RESULT.value = ISSUE_NUMBER
                RESULT.message = [
                    GIT_REPOSITORY_PATH,
                    'issue number is',
                    ISSUE_NUMBER,
                ].join(' ')
            } else {
                RESULT.message = [
                    GIT_REPOSITORY_PATH,
                    'is not on a feature Branch!',
                ].join(' ')
            }
        } else {
            RESULT.message = [
                GIT_REPOSITORY_PATH,
                'is not a git repository!',
            ].join(' ')
        }
        return RESULT
    }

    public async pushOriginHead(
        GIT_REPOSITORY_PATH,
    ): Promise < IResult > {
        const RESULT: IResult = UCommon.getResultObjectOne()
        const R_CHECK_IS_REPO =
        await this.checkIsRepo(GIT_REPOSITORY_PATH)
        if (R_CHECK_IS_REPO.value) {
            const GIT = GIT_P(GIT_REPOSITORY_PATH)
            await GIT.raw([
                'push',
                'origin',
                'HEAD',
            ])

        }

        return RESULT
    }

    public async checkIsMergable(
        BRANCH_NAME: string,
        GIT_REPOSITORY_PATH,
    ): Promise < IResult > {
        const GIT = GIT_P(GIT_REPOSITORY_PATH)

        // RESULT
        const RESULT: IResult = UCommon.getResultObjectOne()

        const R_FETCH = await GIT.raw([
            'fetch',
            'origin',
            BRANCH_NAME,
        ])
        const PATH_BEFORE = process.cwd()
        SHELL.cd(GIT_REPOSITORY_PATH)
        const BRANCH_FULL_NAME  = 'origin/' + BRANCH_NAME
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
            RESULT.value = true
            RESULT.message = 'mergable'
            RESULT.value = true
        } else {
            RESULT.message = 'not mergable'
            RESULT.value = false

        }
        const R_RESET_HARD = await GIT.raw([
            'reset',
            '--hard',
            'ORIG_HEAD',
        ])

        SHELL.cd(PATH_BEFORE)

        return RESULT
    }

}
export const UGit = UGitUtility.getInstance()
