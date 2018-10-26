// https://gitlab.com/divramod/yagpt/issues/7
// IMPORT
const FS = require('fs')
const PATH = require('path')
const SHELL = require('shelljs')
const RIMRAF = require('rimraf')
const GIT_P = require('simple-git/promise')

// TYPINGS
import { IResult, ISubresults } from '@utils/nodejs/common'

// IMPORT
import { UCommon } from '@utils/nodejs/common'
import { UGit } from '@utils/nodejs/git'
import { UJson } from '@utils/nodejs/json'
import { UPath } from '@utils/nodejs/path'
import { expect } from 'chai'
import * as MOCHA from 'mocha'

// EXPORT
export { expect } from 'chai'
export const describe = MOCHA.describe
export const it = MOCHA.it

// CLASS
export class UTestUtility {

    public static getInstance(): UTestUtility {
        return UTestUtility.INSTANCE
    }

    private static INSTANCE: UTestUtility = new UTestUtility()

    public name: string = 'UTestUtility'
    public NPM_REPOSITORY: any
    public TEST_PATH: any

    constructor() {
        if (UTestUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        this.setConstants()

        UTestUtility.INSTANCE = this
    }

    public async userInputCleanup(
        LINE_COUNT: number,
    ): Promise<boolean> {
        let userInputCleanupRun = false
        if (this.getEnv() === 'testing') {
            let cleanupCommand = 'tput cuu1 && echo "'
            for (let i = 0; i < 80; i++) {
                cleanupCommand = cleanupCommand + ' '
            }
            cleanupCommand = cleanupCommand + '" && tput cuu1'
            for (let i = 0; i < LINE_COUNT; i++) {
                SHELL.exec(cleanupCommand)
            }
            userInputCleanupRun = true
        }
        return userInputCleanupRun
    }

    public utilityTestConstructor(
        U,
    ): () => Promise<void> {
        return async () => {
            try {
                const UInstance = new U()
            } catch (e) {
                expect(e.message).to.equal([
                    'Error: Instantiation failed: Use',
                    U.name,
                    '.getInstance() instead of new.',
                ].join(' '))
            }
        }
    }

    public utilityTestGetInstance(
        U_CLASS,
        U_INSTANCE,
    ): () => Promise<void> {
        return async () => {
            expect(U_INSTANCE).to.deep.equal(U_CLASS.getInstance())
        }
    }

    public getEnv(): string {
        return process.env.DMTPL_ENV
    }

    public async gitCreateTestRepositoryAtPath(
        gitRepositoryPath: string,
        createDirectoryIfNotExistant: boolean = true,
        removeDirectoryIfExistant: boolean = true,
        removeGitRepositoryIfExistant: boolean = true,
    ): Promise<IResult> {
        const RESULT = UCommon.getResultObjectMultiple()
        const RESULTS: ISubresults = UCommon.getResultsObject([
            'createDirectoryIfNotExistant',
            'removeDirectoryIfExistant',
            'removeGitRepositoryIfExistant',
        ])

        // NOT EXISTANT
        if (!SHELL.test('-d', PATH.resolve(gitRepositoryPath))) {
            if (createDirectoryIfNotExistant) {
                await this.createTestDirectory(gitRepositoryPath)
            } else { // EXIT
                RESULT.value = false
                RESULT.message = [
                    'Directory',
                    gitRepositoryPath,
                    'not existant',
                ].join(' ')
            }
        } else { // EXISTANT
            // removeDirectoryIfExistant
            if (removeDirectoryIfExistant) {
                SHELL.rm('-rf', PATH.resolve(gitRepositoryPath))
                RESULTS.removeDirectoryIfExistant.value = true
                await this.createTestDirectory(gitRepositoryPath)
            } else {
                // removeGitRepositoryIfExistant
                if (
                    SHELL.test('-d', PATH.resolve(gitRepositoryPath, '.git')) &&
                    removeGitRepositoryIfExistant
                ) {
                    SHELL.rm('-rf', PATH.resolve(gitRepositoryPath, '.git'))
                    RESULTS.removeGitRepositoryIfExistant.value = true
                } else {
                    RESULT.value = true
                    RESULT.message = [
                        'Repository at',
                        gitRepositoryPath,
                        'already existant',
                    ].join(' ')
                }
            }
        }

        if (RESULT.value === undefined) {
            const GIT = GIT_P(gitRepositoryPath)
            await GIT.init()
            const README_PATH = PATH.resolve(gitRepositoryPath, 'README.md')
            SHELL.touch(README_PATH)
            SHELL.ShellString('Line 1').toEnd(README_PATH)
            SHELL.ShellString('\nLine 2').toEnd(README_PATH)
            SHELL.ShellString('\nLine 3').toEnd(README_PATH)
            SHELL.ShellString('\nLine 4').toEnd(README_PATH)
            SHELL.ShellString('\nLine 5').toEnd(README_PATH)
            await GIT.add(README_PATH)
            await GIT.commit('init')
            RESULT.value = true
            const MESSAGE_ARR_DIRECTORY_CREATED = []
            if (RESULTS.removeDirectoryIfExistant.value) {
                MESSAGE_ARR_DIRECTORY_CREATED.push([
                    'Repository at',
                    gitRepositoryPath,
                    'removed and created!',
                ].join(' '))
            }
            RESULT.message = [
                MESSAGE_ARR_DIRECTORY_CREATED.join(' '),
                'Repository created!',
            ].join(' ')
        }
        RESULT.subresults = RESULTS
        return RESULT
    }

    public async createTestDirectory(
        directoryPath: string,
        bDeleteIfDirectoryExistant: boolean = true,
    ): Promise<IResult> {
        // Result Object
        const R = await UCommon.getResultObjectMultiple()

        // PREPARE INTERFACE
        interface ICreateTestDirectoryResults extends ISubresults {
            aPathInTmpTest: IResult;
            bDirectoryExistant: IResult;
            cDeletedIfDirectoryExistant: IResult;
        }

        // PREPARE RESULT OBJECT
        let resultsObject: ICreateTestDirectoryResults =
        UCommon.getResultsObject([
            'aPathInTmpTest',
            'bDirectoryExistant',
            'cDeletedIfDirectoryExistant',
        ])

        // construct path
        const DIRECTORY_PATH = PATH.resolve(directoryPath)

        // check if is in path /tmp/test
        if (DIRECTORY_PATH.indexOf('/tmp/test/') === -1) {
            resultsObject.aPathInTmpTest.value = false
            R.value = false
            R.message = [
                'You can\'t use the directory',
                DIRECTORY_PATH,
                'for testing purposes!',
                'Please use a subdirectory of \'/tmp/test\'!',
            ].join(' ')
        } else {
            resultsObject.aPathInTmpTest.value = true
            const R_CREATE_DIRECTORY = await UPath.createDirectory(
                directoryPath,
                bDeleteIfDirectoryExistant,
            )
            resultsObject = Object.assign(
                resultsObject,
                R_CREATE_DIRECTORY.subresults,
            )
            R.value = R_CREATE_DIRECTORY.value
            R.message = R_CREATE_DIRECTORY.message
        }

        // PREPARE END RESULT
        R.subresults = resultsObject

        return R
    }

    public async createTestFile(
        FILE_PATH,
        FILE_CONTENT = '',
        OVERWRITE_IF_EXISTANT = false,
    ): Promise<IResult> {
        // PREPARE
        let result: IResult = UCommon.getResultObjectOne()

        // RUN
        if (FILE_PATH.indexOf(this.TEST_PATH) !== -1) {
            result = await UPath.createFile(
                FILE_PATH,
                FILE_CONTENT,
                OVERWRITE_IF_EXISTANT,
            )
        } else {
            result.value = false
            result.message = [
                FILE_PATH,
                'not in',
                this.TEST_PATH,
            ].join(' ')

        }

        // RETURN
        return result
    }

    /**
     * Copies
     *
     */
    public async prepareNpmRepository(): Promise<IResult> {
        // PREPARE
        const RESULT: IResult = {
            error: undefined,
            message: undefined,
            value: undefined,
        }
        // RUN
        if (SHELL.test('-d', this.NPM_REPOSITORY.path)) {
            RESULT.value = false
            RESULT.message = [
                this.NPM_REPOSITORY.path,
                'already existant!',
            ].join(' ')
        } else {
            if (SHELL.test('-d', this.NPM_REPOSITORY.path_backup)) {
                SHELL.cp(
                    '-Rf',
                    this.NPM_REPOSITORY.path_backup,
                    this.NPM_REPOSITORY.path,
                )
                RESULT.value = true
                RESULT.message = [
                    this.NPM_REPOSITORY.path,
                    'copied!',
                ].join(' ')
            } else {
                const CMD_CLONE = [
                    'git clone',
                    this.NPM_REPOSITORY.git.ssh,
                    this.NPM_REPOSITORY.path,
                ].join(' ')
                const CMD_FETCH = [
                    'git fetch origin develop',
                    '&&',
                    'git checkout -b develop origin/develop',
                ].join(' ')
                const CMD_CHECKOUT = [
                    'git branch',
                    '&&',
                    'git checkout master',
                ].join(' ')
                const PATH_BEFORE = SHELL.pwd().stdout
                await SHELL.exec(CMD_CLONE, { silent: true })
                SHELL.cd(PATH.resolve(this.NPM_REPOSITORY.path))
                await SHELL.exec(CMD_FETCH, { silent: true })
                await SHELL.exec(CMD_CHECKOUT, { silent: true })
                SHELL.cd(PATH_BEFORE)
                RESULT.value = true
                RESULT.message = [
                    this.NPM_REPOSITORY.path,
                    'cloned!',
                ].join(' ')
            }
        }

        // RETURN
        return RESULT
    }

    public async gitCleanRepository(
        REPOSITORY_PATH,
        COMMIT_MESSAGE,
    ): Promise<IResult> {

        // PREPARE
        const RESULT: IResult = {
            error: undefined,
            message: undefined,
            value: undefined,
        }

        // RUN
        if (SHELL.test('-d', REPOSITORY_PATH)) {
            // COMMIT CHANGES WHEN EXISTANT
            const R_CHECK_IS_CLEAN =
                await UGit.checkIsClean(REPOSITORY_PATH)
            if (R_CHECK_IS_CLEAN === true) {
                RESULT.value = false
                RESULT.message = [
                    REPOSITORY_PATH,
                    'repository already clean!',
                ].join(' ')
            } else {
                const PATH_BEFORE = process.cwd()
                SHELL.cd(this.NPM_REPOSITORY.path)
                const GIT = GIT_P(REPOSITORY_PATH)
                await GIT.raw([
                    'add',
                    '-A',
                ])
                await GIT.raw([
                    'commit',
                    '-m',
                    COMMIT_MESSAGE,
                ])
                SHELL.cd(PATH_BEFORE)
                RESULT.value = true
                RESULT.message = [
                    REPOSITORY_PATH,
                    'repository cleaned!',
                ].join(' ')
            }
        } else {
            RESULT.value = false
            RESULT.message = [
                REPOSITORY_PATH,
                'not existant!',
            ].join(' ')
        }

        // RETURN
        return RESULT
    }

    private setConstants(): void {
        // TESTING
        const YG_CONFIG_PATH = PATH.resolve(
            require('global-modules-path').getPath('yagpt'),
            'yagpt.config.json')
        const R_GET_KEY_VALUE_FROM_FILE = UJson.getKeyValueFromFile(
            YG_CONFIG_PATH,
            'testing',
        )
        this.TEST_PATH = PATH.resolve(R_GET_KEY_VALUE_FROM_FILE.value.path)
        this.NPM_REPOSITORY = R_GET_KEY_VALUE_FROM_FILE.value.npm
    }

}
export const UTest = UTestUtility.getInstance()
