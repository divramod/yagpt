// https://gitlab.com/divramod/yagpt/issues/7
// IMPORT
const FS = require('fs')
const PATH = require('path')
const SHELL = require('shelljs')
const RIMRAF = require('rimraf')
const GIT_P = require('simple-git/promise')

// IMPORT
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
    public npmPackage: any
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

    // TODO
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

    // TODO
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

    // TODO
    public utilityTestGetInstance(
        U_CLASS,
        U_INSTANCE,
    ): () => Promise<void> {
        return async () => {
            expect(U_INSTANCE).to.deep.equal(U_CLASS.getInstance())
        }
    }

    // TODO
    public getEnv(): string {
        return process.env.DMTPL_ENV
    }

    /**
     * Creates a git repository at a given path.
     * @param gitRepositoryPath  The path of the repository.
     * @param removeDirectoryIfExistant  Remove the directory if existant.
     * @returns
     *      1. boolean true: if directory not existant
     *      2. boolean true: if directory existant and removeDirectoryIfExistant
     *                       true
     *      3. string ERROR: if directory existant and if
     *                       removeDirectoryIfExistant=false
     */
    public async gitCreateTestRepositoryAtPath(
        gitRepositoryPath: string,
        removeDirectoryIfExistant: boolean = false,
    ): Promise<string | boolean> {
        let result
        result = true
        let createGitRepository = false
        if (!SHELL.test('-d', PATH.resolve(gitRepositoryPath))) {
            await this.createTestDirectory(gitRepositoryPath)
            createGitRepository = true
        } else {
            if (removeDirectoryIfExistant === true) {
                SHELL.rm('-rf', PATH.resolve(gitRepositoryPath))
                await this.createTestDirectory(gitRepositoryPath)
                createGitRepository = true
            } else {
                result = 'ERROR: directory existant!'
            }
        }

        if (createGitRepository === true) {
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
        }
        return result
    }

    /**
     * Creates a directory in path /tmp/test.
     * @param directoryPath  The path of the directory to create.
     * @param deleteDirectoryIfExistant  If to delete the directory when
     *   existant.
     * @returns
     *      1. boolean true: if directory not existant
     *      2. boolean true: if directory existant and
     *         deleteDirectoryIfExistant=true
     *      3. string ERROR: if directory existant and
     *      4. string ERROR: if directory is not in path /tmp/test
     */
    public async createTestDirectory(
        directoryPath: string,
        deleteDirectoryIfExistant: boolean = false,
    ): Promise<string | boolean> {
        const DIRECTORY_PATH = PATH.resolve(directoryPath)
        let result
        if (DIRECTORY_PATH.indexOf('/tmp/test/') === -1) {
            result = [
                'ERROR:',
                'You can\'t use the directory',
                DIRECTORY_PATH,
                'for testing purposes!',
                'Please use a subdirectory of \'/tmp/test\'!',
            ].join(' ')
        } else {

            const R_CREATE_DIRECTORY = await UPath.createDirectory(
                directoryPath,
                deleteDirectoryIfExistant,
            )
            result = R_CREATE_DIRECTORY
        }
        return result
    }

    /**
     * Creates a test file in directory /tmp/test.
     * @param filePath  The path of the test File.
     * @param fileContent  The content of the test File.
     * @param overwriteIfExistant  Overwrite the file if existant.
     * @returns
     *      1. boolean true: if file not existant
     *      2. boolean true: if file existant and overwriteIfExistant=true
     *      3. string ERROR: if file existant and overwriteIfExistant=false
     */
    public async createTestFile(
        filePath,
        fileContent = '',
        overwriteIfExistant = false,
    ): Promise<string | boolean> {
        let result

        // RUN
        if (filePath.indexOf(this.TEST_PATH) !== -1) {
            result = await UPath.createFile(
                filePath,
                fileContent,
                overwriteIfExistant,
            )
        } else {
            result = [
                filePath,
                'not in',
                this.TEST_PATH,
                'Please use a subdirectory of \'/tmp/test\'!',
            ].join(' ')
        }
        return result
    }

    /**
     * Prepares a NPM repository for testing purposes.
     * @param npmPackagePath  The path where to prepare the npm package.
     * @param overwriteIfExistant  Overwrite the path if existant.
     * @returns
     *      1. boolean=true: if directory not existant
     *      2. boolean=true: if directory existant and overwriteIfExistant=true
     *      3. string ERROR: if directory existant and overwriteIfExistant=false
     */
    // TODO
    // - use copy if existant because it is faster
    // - tests
    public async prepareNpmRepository(
        npmPackagePath: string = this.npmPackage.path,
        overwriteIfExistant: boolean = false,
    ): Promise<string | boolean> {
        let result
        if (SHELL.test('-d', npmPackagePath)) {
            if (overwriteIfExistant === false) {
                result = [
                    'ERROR:',
                    npmPackagePath,
                    'existant!',
                ].join(' ')
            } else {
                result = await this.copyOrClone(
                    this.npmPackage.git.ssh,
                    this.npmPackage.path,
                    this.npmPackage.backupPath,
                    true,
                )
            }
        } else {
            result = await this.copyOrClone(
                this.npmPackage.git.ssh,
                this.npmPackage.path,
                this.npmPackage.backupPath,
            )
        }
        return result
    }

    /**
     * Copies a directory to a given path. If the source path to copy from is
     * not existant, it will clone a git repository from the given repository-
     * url.
     * @param repositoryUrl:  The url of the repository.
     * @param targetPath  The path where to copy/clone to.
     * @param copyFromPath  The path where to copy from.
     * @returns
     *      1. boolean=true: when successful
     *      2. ???
     */
    // TODO tests
    public async copyOrClone(
        repositoryUrl: string,
        targetPath: string,
        copyFromPath: string,
        overwriteIfExistant: boolean = false,
    ): Promise<string | boolean> {
        let result
        result = false
        let run = true
        if (SHELL.test('-d', targetPath) && overwriteIfExistant === false) {
            run = false
            result = [
                'ERROR: Diretory',
                targetPath,
                'is existant!',
            ].join(' ')
        }
        if (run === true) {
            if (SHELL.test('-d', copyFromPath)) {
                SHELL.cp(
                    '-Rf',
                    copyFromPath,
                    targetPath,
                )
                result = true
            } else {
                const GIT = GIT_P()
                const R_CLONE = GIT.clone(
                    repositoryUrl,
                    targetPath,
                )
                result = true
            }
        }
        return result
    }

    // TODO documentation
    // TODO tests
    private setConstants(): void {
        // TESTING
        const YG_CONFIG_PATH = PATH.resolve(
            require('global-modules-path').getPath('yagpt'),
            'yagpt.config.json')
        const R_GET_KEY_VALUE_FROM_FILE = UJson.getKeyValueFromFile(
            YG_CONFIG_PATH,
            'testing',
        )
        this.TEST_PATH = PATH.resolve(R_GET_KEY_VALUE_FROM_FILE.path)
        this.npmPackage = R_GET_KEY_VALUE_FROM_FILE.npm
    }

}
export const UTest = UTestUtility.getInstance()
