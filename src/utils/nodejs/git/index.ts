const GIT_P = require('simple-git/promise')
const gitBranchName = require('branch-name')
const SHELL = require('shelljs')
const PATH = require('path')
const _ = require('underscore')

import { UPath } from '@utils/nodejs/path'

// CLASS
export class UGitUtility {

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
        const R_CHECK_IS_REPO = await this.checkIsRepo(gitRepositoryPath)
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
     * @param mergeFrom  The name of the branch to merge from.
     * @param mergeTo The name of the branch to merge to.
     *  This one is optional, if not passed it will use the currently checked
     *  out branch as mergeTo branch.
     * @returns
     *      1. boolean true: clean
     *      2. boolean true: unclean
     *      3. string: Error: merge conflict
     */
    public async checkIsMergableFromTo(
        gitRepositoryPath: string,
        mergeFrom: string,
        mergeTo?: string,
    ): Promise <boolean | string> {
        const GIT = GIT_P(gitRepositoryPath)
        let result
        const CURRENT_BRANCH_NAME = await this.getBranchName(gitRepositoryPath)
        if (mergeTo === undefined) {
            mergeTo = CURRENT_BRANCH_NAME
        }
        const rCheckIsClean = await this.checkIsClean(gitRepositoryPath)
        let stashed  = false
        if (rCheckIsClean !== true) {
            await GIT.stash()
            stashed = true
        }
        await GIT.checkout(mergeTo)
        const R_MERGABLE = await GIT.raw([
            'merge',
            '--no-ff',
            '--no-commit',
            mergeFrom,
        ])
        if (
            R_MERGABLE === null ||
            R_MERGABLE.indexOf('Already up-to-date.') > -1
        ) {
            result = true
        } else {
            result = [
                'ERROR:',
                [
                    '\nMerge from',
                    mergeFrom,
                    'to',
                    mergeTo,
                    'not possible!',
                ].join(' '),
                '\n\nERRORMESSAGE:',
                '\n',
                R_MERGABLE,
                '\nTODO\'S TO FIX THE ISSUE:',
                [
                    '\n1. Checkout',
                    mergeTo,
                    'and run `git merge',
                    mergeFrom,
                    '`',
                ].join(' '),
                '\n2. fix merge conflicts',
                '\n3. commit',
            ].join('')
            const R_RESET_HARD = await GIT.raw([
                'merge',
                '--abort',
            ])
        }
        await GIT.checkout(CURRENT_BRANCH_NAME)
        if (stashed === true) {
            await GIT.stash(['apply'])
        }
        return result
    }

    /**
     * Stashes the changes of the current branch, when it is dirty.
     * @param gitRepositoryPath  The path of the git repository.
     * @returns
     *      1. boolean true: when repository dirty and changes stashed
     *      2. string ERROR: repository clean when repository clean
     */
    public async stash(
        gitRepositoryPath,
    ): Promise <boolean | string> {
        const GIT = GIT_P(gitRepositoryPath)
        let result
        const R_CHECK_IS_CLEAN = await this.checkIsClean(
            gitRepositoryPath,
        )
        if (R_CHECK_IS_CLEAN === true) {
            result = 'ERROR: repository clean'
        } else {
            await GIT.stash()
            result = true
        }
        return result
    }

    /**
     * Merges mergeFrom one branch mergeTo another. Proves, if merge is possible
     * before doing it.
     * @param gitRepositoryPath  The path of the git repository.
     * @param mergeFrom  The brmergeFrom from which mergeTo merge.
     * @param mergeTo  The brmergeTochmergeToo merge to.
     * @returns
     *      1. string SUCCESS: ...
     *      2. string ERROR: merge conflicts
     */
    public async mergeFromTo(
        gitRepositoryPath: string,
        mergeFrom: string,
        mergeTo: string,
        options: string[] = [],
    ): Promise <boolean | string> {
        const GIT = GIT_P(gitRepositoryPath)
        let result
        const R_CHECK_IS_MERGABLE = await this.checkIsMergableFromTo(
            gitRepositoryPath,
            mergeFrom,
            mergeTo,
        )
        if (R_CHECK_IS_MERGABLE === true) {
            const R_STASH = await this.stash(gitRepositoryPath)
            const CURRENT_BRANCH_NAME =
                await this.getBranchName(gitRepositoryPath)
            await GIT.checkout(mergeTo)
            const R_MERGE = await GIT.raw([
                'merge',
                mergeFrom,
            ])
            result = [
                'SUCCESS:\n',
                R_MERGE,
            ].join('')
            await GIT.checkout(CURRENT_BRANCH_NAME)
            if (R_STASH === true) {
                await GIT.stash(['apply'])
            }
        } else {
            result = R_CHECK_IS_MERGABLE
        }
        return result
    }

    /**
     * Commits changes. If there are files which are not added one can omit
     * filesToAdd which will add all files. When the commit message is
     * ommited, 'update' will automatically be used as commit message.
     * @param gitRepositoryPath  The path of the git repository.
     * @param commitMessage  The commit message to use.
     * @param filesToAdd  The files to add/commit.
     * @returns
     *     1. boolean(true) commitMessage default, filesToCommitTo default
     *     2. boolean(true)
     */
    public async commit(
        gitRepositoryPath: string,
        commitMessage: string = 'update',
        filesToAdd: string[] | string = 'all',
    ): Promise <boolean | string> {
        const GIT = GIT_P(gitRepositoryPath)
        const result = true
        if (filesToAdd === 'all') {
            await GIT.raw([
                'add',
                '-A',
            ])
            await GIT.commit(commitMessage)
        } else {
            await GIT.add(filesToAdd)
            await GIT.commit(commitMessage, filesToAdd)
        }
        return result
    }

    /**
     * Copies or clones a git repository to the local file system. When the
     * path at `pathLocalBackup` is existant and it is a git repository, the
     * directory will be copied to `pathLocalTarget`. If `pathLocalBackup`is
     * not existant or not a git repository and `urlGit`is a clonable git
     * repository, a git repository from `urlGit` will be cloned to
     * `pathLocalTarget`.
     * @param pathLocalTarget  The local target path for copy or clone.
     * @param pathLocalBackup  The local backup path for copy.
     * @param urlGit  The git url where to clone from
     * @param overwriteIfExistant  Overwrite if existant.
     * @returns
     *      1. boolean=true: when target not existant
     *                       (backupExistant=true --> copy)
     *      2. boolean=true: when target existant, overwriteIfExistant=true
     *                       (backupExistant=true --> copy)
     *      3. boolean=true: when target not existant
     *                       (backupExistant=false --> clone)
     *      4. boolean=true: when existant, overwriteIfExistant=true
     *                       (backupExistant=false --> clone)
     *      5. string=ERROR: when existant, overwriteIfExistant=false
     *      6. string=ERROR: pathLocalBackup is not a git repository
     *      7. string=ERROR: `urlGit` is not a git repository url from wher one
     *                       can clone
     *      8. string=ERROR: no Internet connection
     */
    // TODO
    // - be aware of the fact, that this test can only pass, when a internet
    public async copyOrCloneRepository(
        pathLocalTarget: string,
        pathLocalBackup: string,
        urlGit: string,
        overwriteIfExistant: boolean = false,
    ): Promise<boolean | string> {
        let result
        if (SHELL.test('-d', pathLocalTarget)) {
            if (overwriteIfExistant === true) {
                if (SHELL.test('-d', pathLocalBackup)) {
                    result = await UPath.copyDirectory(
                        pathLocalBackup,
                        pathLocalTarget,
                        true,
                    )
                } else {
                    const GIT = GIT_P()
                    const R_CLONE = GIT.clone(
                        urlGit,
                        pathLocalTarget,
                    )
                }
            } else {
                result = [
                    'ERROR:',
                    pathLocalTarget,
                    'existant!',
                ].join(' ')
            }
        } else {
            if (SHELL.test('-d', pathLocalBackup)) {
                result = await UPath.copyDirectory(
                    pathLocalBackup,
                    pathLocalTarget,
                    true,
                )
            } else {
                const GIT = GIT_P()
                const R_CLONE = GIT.clone(
                    urlGit,
                    pathLocalTarget,
                )
            }
        }
        return result
    }

}
export const UGit = new UGitUtility()
