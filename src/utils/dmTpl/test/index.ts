// https://gitlab.com/divramod/dm-tpl/issues/7

// IMPORT
const SHELL = require('shelljs')

// TYPINGS

// CLASS
export class UTest {

    public static getInstance(): UTest {
        return UTest.INSTANCE
    }

    private static INSTANCE: UTest = new UTest()

    constructor() {
        if (UTest.INSTANCE) {
            throw new Error('Error: Instantiation failed: Use UTest.getInstance() instead of new.')
        }
        UTest.INSTANCE = this
    }

    public async userInputCleanup(LINE_COUNT: number) {
        let userInputCleanupRun = false
        if (this.getEnv() === 'testing') {
            let cleanupCommand = 'tput cuu1 && echo "'
            for (let i = 0; i < 120; i++) {
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

}
