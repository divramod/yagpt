// https://gitlab.com/divramod/dm-tpl/issues/7
// IMPORT
const PATH = require('path')
const SHELL = require('shelljs')
const RIMRAF = require('rimraf')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// IMPORT
import { UCommon } from '@utils/nodejs/common'
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

    public async userInputCleanup(LINE_COUNT: number): Promise<boolean> {
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

    public utilityTestConstructor(U): () => Promise<void> {
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

    public utilityTestGetInstance(U_CLASS, U_INSTANCE): () => Promise<void> {
        return async () => {
            expect(U_INSTANCE).to.deep.equal(U_CLASS.getInstance())
        }
    }

    public async createTestDirectory(PARAMS: {
        directoryPath: string,
        bDeleteIfDirectoryExistant: boolean,
    }): Promise<IResultMultiple> {
        // Result Object
        const R = await UCommon.getResultObjectMultiple()

        // PREPARE INTERFACE
        interface ICreateTestDirectoryResults extends IResults {
            aPathInTmpTest: IResultOne;
            bDirectoryExistant: IResultOne;
            cDeletedIfDirectoryExistant: IResultOne;
        }

        // PREPARE RESULT OBJECT
        const RESULTS_OBJECT: ICreateTestDirectoryResults =
        UCommon.getResultsObject([
            'aPathInTmpTest',
            'bDirectoryExistant',
            'cDeleteIfDirectoryExistant',
        ])

        // construct path
        const DIRECTORY_PATH = PATH.resolve(PARAMS.directoryPath)

        // check if is in path /tmp/test
        if (DIRECTORY_PATH.indexOf('/tmp/test/') === -1) {
            RESULTS_OBJECT.aPathInTmpTest.value = false
            R.success = false
            R.message = [
                'You can\'t use the directory',
                DIRECTORY_PATH,
                'for testing purposes!',
                'Please use a subdirectory of \'/tmp/test\'!',
            ].join(' ')
        } else {
            RESULTS_OBJECT.aPathInTmpTest.value = true
            if (PARAMS.bDeleteIfDirectoryExistant) {
                RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
                SHELL.mkdir('-p', DIRECTORY_PATH) // CREATE DIRECTORY
                R.message = [
                    'Directory',
                    DIRECTORY_PATH,
                    'removed and created',
                ].join(' ')
            } else {
                R.message = [
                    'Directory',
                    DIRECTORY_PATH,
                    'existant and not created',
                ].join(' ')
            }
            R.success = true
        }

        // PREPARE END RESULT
        R.results = RESULTS_OBJECT

        return R
    }

    public getEnv(): string {
        return process.env.DMTPL_ENV
    }

}
export const UTest = UTestUtility.getInstance()
