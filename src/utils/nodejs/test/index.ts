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

    public configPath: string = PATH.resolve(
        require('global-modules-path').getPath('yagpt'),
        'yagpt.config.json',
    )
    public config: any = UJson.getKeyValueFromFile(
        this.configPath,
        'testing',
    )
    public npmPackage: any = this.config.npm
    public testPath: string = PATH.resolve(
        this.config.path,
    )

    /**
     * Returns the environment variable of the module.
     * @returns  [testing|development|production]
     */
    public getEnv(): string {
        return process.env.DMTPL_ENV
    }

    /**
     * Cleans up cli output.
     * @param numberOfLinesToCleanup  The number of lines to clean up.
     * @returns
     *      1. boolean=true: when cleanup was run and env=testing
     *      2. boolean=false: when env!==testing
     */
    public async userInputCleanup(
        numberOfLinesToCleanup: number,
    ): Promise < boolean > {
        let userInputCleanupRun = false
        if (this.getEnv() === 'testing') {
            let cleanupCommand = 'tput cuu1 && echo "'
            for (let i = 0; i < 80; i++) {
                cleanupCommand = cleanupCommand + ' '
            }
            cleanupCommand = cleanupCommand + '" && tput cuu1'
            for (let i = 0; i < numberOfLinesToCleanup; i++) {
                SHELL.exec(cleanupCommand)
            }
            userInputCleanupRun = true
        }
        return userInputCleanupRun
    }

    /**
     * Creates a git repository at a given path.
     * @param gitRepositoryPath  The path of the repository.
     * @param removeDirectoryIfExistant  Remove the directory if existant.
     * @returns
     *      1. boolean=true: if directory not existant
     *      2. boolean=true: if directory existant and removeDirectoryIfExistant
     *                       true
     *      3. string=ERROR: if directory existant and if
     *                       removeDirectoryIfExistant=false
     */
    public async gitCreateTestRepositoryAtPath(
        gitRepositoryPath: string,
        removeDirectoryIfExistant: boolean = false,
    ): Promise < string | boolean > {
        let result
        let createGitRepository = false
        if (!SHELL.test('-d', PATH.resolve(gitRepositoryPath))) {
            await this.createTestDirectory(gitRepositoryPath)
            createGitRepository = true
            result = true
        } else {
            if (removeDirectoryIfExistant === true) {
                SHELL.rm('-rf', PATH.resolve(gitRepositoryPath))
                await this.createTestDirectory(gitRepositoryPath)
                createGitRepository = true
                result = true
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
     * @param overwriteIfExistant  If to delete the directory when
     *   existant.
     * @returns
     *      1. boolean true: if directory not existant
     *      2. boolean true: if directory existant and
     *         overwriteIfExistant=true
     *      3. string ERROR: if directory existant and
     *         overwriteIfExistant=false
     *      4. string ERROR: if directory is not in path /tmp/test
     */
    public async createTestDirectory(
        directoryPath: string,
        overwriteIfExistant: boolean = false,
    ): Promise < string | boolean > {
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
            result = await UPath.createDirectory(
                directoryPath,
                overwriteIfExistant,
            )
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
     *      4. string ERROR: not in /tmp/test when not in /tmp/test
     */
    public async createTestFile(
        filePath,
        fileContent = '',
        overwriteIfExistant = false,
    ): Promise < string | boolean > {
        let result

        // RUN
        if (filePath.indexOf(this.testPath) !== -1) {

            result = await UPath.createFile(
                filePath,
                fileContent,
                overwriteIfExistant,
            )
        } else {
            result = [
                'ERROR:',
                filePath,
                'not in',
                this.testPath,
                'Please use a subdirectory of \'/tmp/test\'!',
            ].join(' ')
        }
        return result
    }

}

export const UTest = new UTestUtility()
