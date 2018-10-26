const SHELL = require('shelljs')
export class UNpmUtility {

    /**
     * Relinks a npm package globally.
     * https://docs.npmjs.com/cli/link
     * @param packagePath The local path of the package.
     * @param packageName  The name of the package
     * @returns
     *      1. boolean=true: if everything went fine
     *      2. string=ERROR: `packagePath` not existant!
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
                'ERROR:',
                packagePath,
                'not existant!',
            ].join(' ')
        }
        return result
    }

}

export const UNpm = new UNpmUtility()
