// https://gitlab.com/divramod/yagpt/issues/7
// IMPORT
const FS = require('fs')
const PATH = require('path')
const SHELL = require('shelljs')
const RIMRAF = require('rimraf')
const GIT_P = require('simple-git/promise')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

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

const R_GET_KEY_VALUE_FROM_FILE = UJson.getKeyValueFromFile(
    PATH.resolve(
        process.cwd(),
        'yagpt.config.json'),
    'testing',
)
export const TEST_PATH = PATH.resolve(R_GET_KEY_VALUE_FROM_FILE.value.path)
export const TEST_NPM_REPOSITORY = R_GET_KEY_VALUE_FROM_FILE.value.npm
export const TEST_PATH_NPM = PATH.resolve(
    R_GET_KEY_VALUE_FROM_FILE.value.npm.path,
)

// CLASS
export class UTestUtility {

    public static getInstance(): UTestUtility {
        return UTestUtility.INSTANCE
    }

    private static INSTANCE: UTestUtility = new UTestUtility()

    public name: string = 'UTestUtility'

    constructor() {
        if (UTestUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
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
        repoPath: string,
        createDirectoryIfNotExistant: boolean = true,
        removeDirectoryIfExistant: boolean = true,
        removeGitRepositoryIfExistant: boolean = true,
    ): Promise<IResultMultiple> {
        const RESULT = UCommon.getResultObjectMultiple()
        const RESULTS: IResults = UCommon.getResultsObject([
            'createDirectoryIfNotExistant',
            'removeDirectoryIfExistant',
            'removeGitRepositoryIfExistant',
        ])

        // NOT EXISTANT
        if (!SHELL.test('-d', PATH.resolve(repoPath))) {
            if (createDirectoryIfNotExistant) {
                await this.createTestDirectory(repoPath)
            } else { // EXIT
                RESULT.success = false
                RESULT.message = 'Directory ' + repoPath + ' not existant'
            }
        } else { // EXISTANT
            // removeDirectoryIfExistant
            if (removeDirectoryIfExistant) {
                SHELL.rm('-rf', PATH.resolve(repoPath))
                RESULTS.removeDirectoryIfExistant.success = true
                await this.createTestDirectory(repoPath)
            } else {
                // removeGitRepositoryIfExistant
                if (
                    SHELL.test('-d', PATH.resolve(repoPath, '.git')) &&
                    removeGitRepositoryIfExistant
                ) {
                    SHELL.rm('-rf', PATH.resolve(repoPath, '.git'))
                    RESULTS.removeGitRepositoryIfExistant.success = true
                } else {
                    RESULT.success = true
                    RESULT.message = [
                        'Repository at',
                        repoPath,
                        'already existant',
                    ].join(' ')
                }
            }
        }

        if (RESULT.success === undefined) {
            const GIT = GIT_P(repoPath)
            await GIT.init()
            RESULT.success = true
            const MESSAGE_ARR_DIRECTORY_CREATED = []
            if (RESULTS.removeDirectoryIfExistant.success) {
                MESSAGE_ARR_DIRECTORY_CREATED.push(
                    'Repository at ' + repoPath + ' removed and created!',
                )
            }
            RESULT.message = [
                MESSAGE_ARR_DIRECTORY_CREATED.join(' '),
                'Repository created!',
            ].join(' ')

        }

        RESULT.results = RESULTS
        return RESULT
    }

    public async createTestDirectory(
        directoryPath: string,
        bDeleteIfDirectoryExistant: boolean = true,
    ): Promise<IResultMultiple> {
        // Result Object
        const R = await UCommon.getResultObjectMultiple()

        // PREPARE INTERFACE
        interface ICreateTestDirectoryResults extends IResults {
            aPathInTmpTest: IResultOne;
            bDirectoryExistant: IResultOne;
            cDeletedIfDirectoryExistant: IResultOne;
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
            R.success = false
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
                R_CREATE_DIRECTORY.results,
            )
            R.success = R_CREATE_DIRECTORY.success
            R.message = R_CREATE_DIRECTORY.message
        }

        // PREPARE END RESULT
        R.results = resultsObject

        return R
    }

    public async createTestFile(
        FILE_PATH,
        FILE_CONTENT = '',
        OVERWRITE_IF_EXISTANT = false,
    ): Promise<IResultOne> {
        // PREPARE
        let result: IResultOne = UCommon.getResultObjectOne()

        // RUN
        if (FILE_PATH.indexOf(TEST_PATH) !== -1) {
            result = await UPath.createFile(
                FILE_PATH,
                FILE_CONTENT,
                OVERWRITE_IF_EXISTANT,
            )
        } else {
            result.success = false
            result.message = [
                FILE_PATH,
                'not in',
                TEST_PATH,
            ].join(' ')

        }

        // RETURN
        return result
    }

    public async prepareNpmRepository(): Promise<IResultOne> {
        // PREPARE
        const RESULT: IResultOne = {
            error: undefined,
            message: undefined,
            success: undefined,
            value: undefined,
        }
        const R = await UGit.checkIsClean(TEST_NPM_REPOSITORY.path)
        if (R !== false) {

            const PATH_BEFORE = process.cwd()
            SHELL.cd(TEST_NPM_REPOSITORY.path)
            // SHELL.exec('git add -A', {silent: true})
            const GIT = GIT_P(TEST_NPM_REPOSITORY.path)
            await GIT.raw([
                'add',
                '-A',
            ])
            // SHELL.exec('git commit -m "update"', {silent: true})
            await GIT.raw([
                'commit',
                '-m',
                'update',
            ])
            SHELL.cd(PATH_BEFORE)
        }

        // RUN
        if (SHELL.test('-d', TEST_NPM_REPOSITORY.path)) {
            RESULT.success = false
            RESULT.message = [
                TEST_NPM_REPOSITORY.path,
                'exitant!',
            ].join(' ')
        } else {
            const CMD_CLONE = [
                'git clone',
                TEST_NPM_REPOSITORY.git.ssh,
                TEST_NPM_REPOSITORY.path,
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
            SHELL.cd(PATH.resolve(TEST_NPM_REPOSITORY.path))
            await SHELL.exec(CMD_FETCH, { silent: true })
            await SHELL.exec(CMD_CHECKOUT, { silent: true })
            SHELL.cd(PATH_BEFORE)
            RESULT.success = true
            RESULT.message = [
                TEST_NPM_REPOSITORY.path,
                'cloned!',
            ].join(' ')
        }

        // RETURN
        return RESULT
    }

}
export const UTest = UTestUtility.getInstance()
