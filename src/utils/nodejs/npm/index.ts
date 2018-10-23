// https://gitlab.com/divramod/dm-tpl/issues/4

// IMPORT
import { UCommon } from '@utils/nodejs/common'

// REQUIRE
const SHELL = require('shelljs')

// TYPINGS
import { IResult } from '@utils/nodejs/common'

// CLASS
export class UNpmUtility {

    public static getInstance(): UNpmUtility {
        return UNpmUtility.INSTANCE
    }

    private static INSTANCE: UNpmUtility = new UNpmUtility()
    public name: string = 'UNpmUtility'

    constructor() {
        if (UNpmUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        UNpmUtility.INSTANCE = this
    }

    /**
     * TODO: get package name
     */
    public async relink(
        PACKAGE_PATH,
        PACKAGE_NAME,
    ): Promise<IResult> {

        // PREPARE
        const RESULT: IResult = UCommon.getResultObjectOne()

        // RUN
        if (SHELL.test('-d', PACKAGE_PATH)) {
            const PATH_BEFORE = process.cwd()
            SHELL.cd(PACKAGE_PATH)
            SHELL.exec([
                'sudo',
                'npm rm --global',
                PACKAGE_NAME,
            ].join(' '), {
                silent: true,
            } )
            SHELL.exec([
                'npm link',
            ].join(' '), {
                silent: true,
            } )
            SHELL.cd(PATH_BEFORE)
            RESULT.message = [
                PACKAGE_PATH,
                'relinked!',
            ].join(' ')
            RESULT.value = true
        } else {
            RESULT.message = [
                PACKAGE_PATH,
                'not relinked (not existant)!',
            ].join(' ')
            RESULT.value = false
        }

        // RETURN
        return RESULT
    }

}
export const UNpm = UNpmUtility.getInstance()
