// https://gitlab.com/divramod/dm-tpl/issues/7

// IMPORT
const SHELL = require('shelljs')

// TYPINGS

// IMPORT
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
            throw new Error('Error: Instantiation failed: Use ' + this.name + '.getInstance() instead of new.')
        }
        UTestUtility.INSTANCE = this
    }

    public async userInputCleanup(LINE_COUNT: number) {
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

    public getEnv() {
        return process.env.DMTPL_ENV
    }

    public utilityTestConstructor(U) {
        return async () => {
            try {
                const UInstance = new U()
            } catch (e) {
                expect(e.message).to.equal(
                    'Error: Instantiation failed: Use ' + U.name + '.getInstance() instead of new.',
                )
            }
        }
    }

    public utilityTestGetInstance(U_CLASS, U_INSTANCE) {
        return async () => {
            expect(U_INSTANCE).to.deep.equal(U_CLASS.getInstance())
        }
    }

}
export const UTest = UTestUtility.getInstance()
