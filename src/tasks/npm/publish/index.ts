import { UJson } from '@utils/nodejs/json'
import { UPath } from '@utils/nodejs/path'
import { UGit } from '@utils/tools/git'
import { UNpm } from '@utils/tools/npm'
import { ITask, UTask } from '@utils/yagpt/task'
const GIT_P = require('simple-git/promise')
const SEMVER = require('semver')
const SHELL = require('shelljs')
const PATH = require('path')
const programCommander = require('commander')

/**
 * This Class helps publishing an npm package. It is the first task I wrote for
 * the Package.
 *
 * A task class usually has to implement different functions as stated in ITask.
 * These are:
 * - checkPrerequisites(): for checking if the task can be run
 * - setOptions(): for setting the information the task needs for running
 * - runSteps(): for running the steps of the task
 *
 * For setting the options of a task it is possible to do it in different ways:
 * 1. with the options of the program (commander) -p -v
 * 2. with an options object passed to the run function of the task
 * 3. with an options object passed to the constructor of the task class
 * 4. with default values
 * 5. with values gotten from questions answered in a prompt
 *
 * @param projectPath
 *   The path where the package exists.
 * @param versionPart
 *   The part of the version to increment
 *
 * @TODO
 * ```
 * - [ ] how to combine the 5 options to set the options for a task
 * - [ ] add setOptions(): use steps too?
 *   - [ ] parseOptions()
 *   - [ ] getDefaults()
 * - [ ] add printHelp()
 * - [ ] add runPrompt() --> needs to explicitly called
 * - [ ] checkPrerequisites(): use steps
 * ```
 */
// export class NpmPublishTask extends UTask implements ITask {
export class NpmPublishTask extends UTask {

    /**
     * - [ ] comment
     */
    private program: any

    /**
     * The path where to run the Publish task in.
     */
    private projectPath: string

    /**
     *
     */
    private description: string

    /**
     * The part of the versionnumber, saved in the package.json of a project to
     * increment. Possible values are major, minor, patch.
     * @see [https://semver.org](https://semver.org)
     */
    private semverVersionPart: string

    /**
     * @TODO
     * ```
     *
     * - [ ] comment
     * ```
     */
    constructor(
        options?: any,
    ) {
        super()
        super.setChild(this)
        this.name = 'NpmPublishTask'
        this.description = '...'

        this.program = programCommander
        this.program.description(this.description)
        this.program.option(
            '-p, --projectPath <projectPath>',
            'The Project Path',
        )
        this.program.option(
            '-s, --semverVersionPart <semverVersionPart>',
            'The Semver Version Part which should be incremented',
        )
        this.program.parse(process.argv)

        this.setOptions(options)
    }

    /**
     * getProgram
     *
     * @param
     * @returns
     * ```
     * - [ ]
     * ```
     * @TODO
     * ```
     *
     * - [ ] write comments
     * - [ ] create tests
     * - [ ] implement code
     * ```
     */
    public getProgram(): any {
        let result
        result = true

        return result
    }

    /**
     * getPrompt
     *
     * @param
     * @returns
     * ```
     * - [ ]
     * ```
     * @TODO
     * ```
     *
     * - [ ] write comments
     * - [ ] create tests
     * - [ ] implement code
     * ```
     */
    public getPrompt(): any {
        let result
        result = true
        return result
    }

    /**
     * Tests, if the prerequisites for running [[runSteps]] are met.
     * @returns
     * ```
     * isGitRepository: string | boolean
     * - if the given `PROJECT_PATH` is a git repository
     * isFeatureBranch: string | boolean
     * - if the git repository is on a feature branch
     * isClean: string | boolean
     * - if the directory is a clean git repository
     * isDevelopMergable: string | boolean
     * - if the branch development is mergable into the current feature branch
     * value: boolean
     * - true, if all prerequisites are met
     * - false, if one of the prerequisites isn't met
     * TODO projectPathNotUndefined
     * TODO isCorrectVersionPart
     * - tests, if `this.semverVersionPart` is an official semver version part
     * TODO isNpmPackage: string | boolean
     * - if `this.projectPath` contains an npm package
     * ```
     */
    public async checkPrerequisites(): Promise<any> {
        const RESULT = {
            isClean: undefined,
            isDevelopMergable: undefined,
            isFeatureBranch: undefined,
            isGitRepository: undefined,
        }
        const branchName = await UGit.getBranchName(this.projectPath)
        RESULT.isGitRepository = await UGit.checkIsRepo(this.projectPath)
        RESULT.isFeatureBranch = await UGit.checkIsFeatureBranch(
            this.projectPath,
        )
        RESULT.isClean = await UGit.checkIsClean(this.projectPath)
        RESULT.isDevelopMergable = await UGit.checkIsMergableFromTo(
            this.projectPath,
            'develop',
        )
        return RESULT
    }

    /**
     * Publishes an npm package. Because i use git flow as workflow, the package
     * needs to meet some prerequisites. For seeing them go to the docs of the
     * [[checkPrerequisites]] function in the current class.
     * ```
     * Steps:
     * TODO
     * ```
     * @param PROJECT_PATH  The path of the project, which will be published.
     * @returns
     *      checkPrerequisites: IIsRunnable
     *      - result from the checkPrerequisites() prerequisites check
     *      value: boolean
     *      - true: when everything went fine
     *      - false: when something happened
     *      error: undefined | error
     *      - undefined: when everything went fine
     *      - error: the error which has been raised
     *      log: ILogEntry[]
     */
    public async runSteps(): Promise<any> {

        const PROJECT_PATH = this.projectPath
        const PATH_BEFORE = process.cwd()

        // step
        const FEATURE_NAME = await super.runStep({
            comment: 'test comment',
            name: 'getFeatureName',
        }, async () => await UGit.getFeatureName(PROJECT_PATH))

        // step
        const ISSUE_NUMBER = await super.runStep({
            comment: 'gets the issue number',
            name: 'getFeatureIssueNumber',
        }, async () => await UGit.getFeatureIssueNumber(PROJECT_PATH))

        // step
        await super.runStep({
            comment: 'checks out develop',
            name: 'gitFetchOriginDevelop',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'fetch',
                'origin',
                'develop',
            ])
        })

        // step
        await super.runStep({
            comment: '',
            name: 'gitMergeOriginDevelop',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'merge',
                '-m',
                'MERGE DEVELOP"',
                'origin/develop',
            ])
        })

        // step
        await super.runStep({
            comment: '',
            name: 'gitCheckoutDevelop',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'checkout',
                'develop',
            ])
        })

        // step
        await super.runStep({
            comment: '',
            name: 'gitMergeFeatureIntoDevelop',
        }, async () => {
            const FEATURE_FULL_NAME = [
                'feature/',
                ISSUE_NUMBER,
                '-',
                FEATURE_NAME,
            ].join('')
            return await UGit.raw(PROJECT_PATH, [
                'merge',
                FEATURE_FULL_NAME,
            ])
        })

        // step
        await super.runStep({
            comment: 'pushes the develop',
            name: 'gitPushOriginHEAD',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'push',
                '-u',
                'origin',
                'HEAD',
            ])
        })

        // step
        const NEXT_VERSION_NUMBER = await super.runStep({
            comment: 'increments the version number as patch',
            name: 'semverIncrementVersionNumber',
        }, async () => {
            const R_CURRENT_VERSION_NUMBER = UJson.getKeyValueFromFile(
                PATH.resolve(PROJECT_PATH, 'package.json'),
                'version',
            )
            const CURRENT_VERSION_NUMBER = R_CURRENT_VERSION_NUMBER.value
            return SEMVER.inc(
                CURRENT_VERSION_NUMBER,
                'patch',
            )
        })

        // step
        await super.runStep({
            comment: 'checks out a new branch for the release',
            name: 'gitCheckoutRelease',
        }, async () => {
            const FULL_RELEASE_NAME = 'release/' + NEXT_VERSION_NUMBER
            return await UGit.raw(PROJECT_PATH, [
                'checkout',
                '-b',
                FULL_RELEASE_NAME,
            ])
        })

        // step
        // TODO write function
        await super.runStep({
            comment: 'patches the npm version',
            name: 'npmVersionPatch',
        }, async () => {
            SHELL.cd(PROJECT_PATH)
            const R = SHELL.exec('npm version patch', { silent: true })
            SHELL.cd(PATH_BEFORE)
            return R
        })

        // step
        await super.runStep({
            comment: 'adds the changes to be tracked',
            name: 'gitAddAll',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'add',
                '-A',
            ])
        })

        // step
        await super.runStep({
            comment: 'creates a commit for the release',
            name: 'gitCommitReleaseMessage',
        }, async () => {
            const FULL_RELEASE_MESSAGE = [
                '-m',
                '"RELEASE ' + NEXT_VERSION_NUMBER + '"',
            ].join(' ')
            return await UGit.raw(PROJECT_PATH, [
                'commit',
                FULL_RELEASE_MESSAGE,
            ])
        })

        // step
        await super.runStep({
            comment: 'checks out develop',
            name: 'gitCheckoutDevelop',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'checkout',
                'develop',
            ])
        })

        // step
        await super.runStep({
            comment: 'merges release into develop',
            name: 'gitMergeReleaseIntoDevelop',
        }, async () => {
            const FULL_RELEASE_NAME = 'release/' + NEXT_VERSION_NUMBER
            return await UGit.raw(PROJECT_PATH, [
                'merge',
                FULL_RELEASE_NAME,
            ])
        })

        // step
        // TODO
        await super.runStep({
            comment: '',
            name: 'gitPushOriginHEAD',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'push',
                '-u',
                'origin',
                'HEAD',
            ])
        })

        // step
        await super.runStep({
            comment: 'checks out master',
            name: 'gitCheckoutMaster',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'checkout',
                'master',
            ])
        })

        // step
        await super.runStep({
            comment: '',
            name: 'gitMergeReleaseIntoMaster',
        }, async () => {
            const FULL_RELEASE_NAME = 'release/' + NEXT_VERSION_NUMBER
            return await UGit.raw(PROJECT_PATH, [
                'merge',
                FULL_RELEASE_NAME,
            ])
        })

        // step
        // TODO
        await super.runStep({
            comment: '',
            name: 'gitPushOriginHEAD',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'push',
                '-u',
                'origin',
                'HEAD',
            ])
        })

        // step
        // TODO: write function
        await super.runStep({
            comment: '',
            name: 'npmPublish',
        }, async () => {
            SHELL.cd(PROJECT_PATH)
            const RESULT = SHELL.exec('npm publish', { silent: true })
            SHELL.cd(PATH_BEFORE)
            return RESULT
        })

        // step
        await super.runStep({
            comment: '',
            name: 'gitPushTags',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'push',
                '--tags',
            ])
        })

        // step
        await super.runStep({
            comment: '',
            name: 'gitBranchDeleteRelease',
        }, async () => {
            const FULL_RELEASE_NAME = 'release/' + NEXT_VERSION_NUMBER
            return await UGit.raw(PROJECT_PATH, [
                'branch',
                '-D',
                FULL_RELEASE_NAME,
            ])
        })

        // step
        await super.runStep({
            comment: 'Checks out the Feature on which it was originally on.',
            name: 'gitCheckoutFeature',
        }, async () => {
            const FEATURE_FULL_NAME = [
                'feature/',
                ISSUE_NUMBER,
                '-',
                FEATURE_NAME,
            ].join('')
            return await UGit.raw(PROJECT_PATH, [
                'checkout',
                FEATURE_FULL_NAME,
            ])
        })

        // step
        await super.runStep({
            comment: '',
            name: 'gitMergeDevelop',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'merge',
                'develop',
            ])
        })

        // step
        // TODO
        await super.runStep({
            comment: '',
            name: 'gitPushOriginHEAD',
        }, async () => {
            return await UGit.raw(PROJECT_PATH, [
                'push',
                '-u',
                'origin',
                'HEAD',
            ])
        })
    }

    /**
     * private setOptions
     *
     * @param
     * @returns
     * ```
     * - [ ]
     * ```
     * @TODO
     * ```
     *
     * - [ ] create result object
     * ```
     */
    public setOptions(
        options?: any,
    ): any {

        // TODO proof, if program is run from cli or programmatically
        if (options === undefined) {

            // set this.projectPath
            if (this.program.projectPath) {
                const PROJECT_PATH = UPath.checkIfPathIsDirectory(
                    this.program.projectPath,
                )
                if (PROJECT_PATH === true) {
                    // 1 is a directory
                    this.projectPath === PATH.resolve(
                        this.program.projectPath,
                    )
                } else {
                    // 2 ERROR: is not a directory
                    this.projectPath = undefined
                }
            } else {
                // 3 no path given
                // --> take path from where the script is run (DEFAULT)
                this.projectPath === PATH.resolve('.')
            }

            // set this.semverVersionPart
            if (this.program.semverVersionPart) {
                const R_CHECK_IS_SEMVER_VERSION_PART =
                    UNpm.checkIsSemverVersionPart(
                        this.program.semverVersionPart,
                    )
                if  (R_CHECK_IS_SEMVER_VERSION_PART === true) {
                    // 1 is a semverVersionPart
                    this.semverVersionPart = this.program.semverVersionPart
                } else {
                    // ERROR: is not a semver compatiple version part
                    this.semverVersionPart = undefined
                }
            } else {
                this.semverVersionPart = 'patch'
            }
        } else {
            this.projectPath = options.projectPath
            this.semverVersionPart = options.semverVersionPart
        }

        // 2. use default values if given

        // 3. use prompt/input when still undefined

        // 4. break if some mandantory option couldn't be set
        return true
    }

}
export const TNpmPublish = NpmPublishTask
export const Class = NpmPublishTask
