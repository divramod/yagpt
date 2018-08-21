// https://gitlab.com/divramod/dm-tpl/issues/4

// IMPORT
const GIT_P = require('simple-git/promise')
const branchName = require('branch-name')

// TYPINGS

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
    public async isFeatureBranch(): Promise<boolean> {
        return true
    }

    public init(PATH): boolean {
        this.GIT = GIT_P(PATH)
        this.repositoryPath = PATH
        return true
    }

    public getRepositoryPath(): string {
        return this.repositoryPath
    }

    public setRepositoryPath(PATH): void {
        this.repositoryPath = PATH
    }

    public async getBranchName(): Promise<string> {
        this.branchName = await branchName.get()
        return this.branchName
    }

}
export const UGit = UGitUtility.getInstance()
