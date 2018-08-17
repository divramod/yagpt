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
        const CLEANUP_COMMAND = 'tput cuu1 && echo "                                                " && tput cuu1'
        for (let i = 0; i < LINE_COUNT; i++) {
            SHELL.exec(CLEANUP_COMMAND)
        }
        userInputCleanupRun = true
        return userInputCleanupRun
    }

    public async getEnv() {
        return true
    }

}
