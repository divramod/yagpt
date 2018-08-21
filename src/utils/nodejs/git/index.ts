// https://gitlab.com/divramod/dm-tpl/issues/4

// IMPORT
const GIT_P = require('simple-git/promise')
const branchName = require('branch-name')
const SHELL = require('shelljs')
const PATH = require('path')

// IMPORT
import { UCommon } from '@utils/nodejs/common'
import { UTest } from '@utils/nodejs/test'

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// CLASS
export class UGitUtility {

    public static getInstance(): UGitUtility {
        return UGitUtility.INSTANCE
    }

    private static INSTANCE: UGitUtility = new UGitUtility()
    public name: string = 'UGitUtility'

    private GIT: any
    private branchName: string
    private repositoryPath: string

    private i: string = ''

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

    // TODO
    public async isFeatureBranch(
        GIT_REPOSITORY_PATH: string,
    ): Promise<IResultOne> {

        // RESULT
        const RESULT: IResultOne = UCommon.getResultObjectOne()

        if (await this.checkIsRepo(GIT_REPOSITORY_PATH)) {
            const BRANCH_NAME = await this.getBranchName(GIT_REPOSITORY_PATH)
            if (BRANCH_NAME.indexOf('feature/') !== -1) {
                RESULT.value = true
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

    public init(REPO_PATH): boolean {
        this.GIT = GIT_P(REPO_PATH)
        this.repositoryPath = REPO_PATH
        return true
    }

    public async checkIsRepo(
        DIRECTORY_PATH,
    ): Promise<boolean> {
        const GIT = GIT_P(DIRECTORY_PATH)
        const CWD_BEFORE = process.cwd()
        process.chdir(DIRECTORY_PATH)
        const RESULT: boolean = GIT.checkIsRepo()
        process.chdir(CWD_BEFORE)
        return RESULT
    }

    public async getBranchName(GIT_REPOSITORY_PATH): Promise<string> {
        let result
        if (await this.checkIsRepo(GIT_REPOSITORY_PATH)) {
            result = await branchName.get({
                cwd: GIT_REPOSITORY_PATH,
            })
        }
        return result
    }

    public async checkoutBranch(
        GIT_REPOSITORY_PATH,
        BRANCH_NAME,
    ): Promise<boolean> {
        let result = false
        if (await this.checkIsRepo(GIT_REPOSITORY_PATH)) {
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

}
export const UGit = UGitUtility.getInstance()
