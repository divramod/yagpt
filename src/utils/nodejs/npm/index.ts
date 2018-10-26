const SHELL = require('shelljs')
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
        packagePath,
        packageName,
    ): Promise<string | boolean> {
        let result
        if (SHELL.test('-d', packagePath)) {
            const PATH_BEFORE = process.cwd()
            SHELL.cd(packagePath)
            SHELL.exec([
                'sudo',
                'npm rm --global',
                packageName,
            ].join(' '), {
                silent: true,
            } )
            SHELL.exec([
                'npm link',
            ].join(' '), {
                silent: true,
            } )
            SHELL.cd(PATH_BEFORE)
            result = true
        } else {
            result = [
                packagePath,
                'not relinked (not existant)!',
            ].join(' ')
        }
        return result
    }

}
export const UNpm = UNpmUtility.getInstance()
