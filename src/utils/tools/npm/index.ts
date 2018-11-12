const SHELL = require('shelljs')
import { UGit } from '@utils/tools/git'
import { UConfig } from '@utils/yagpt/config'

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
        packagePath: string,
        packageName: string,
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

    /**
     * A convinience function for copyOrCloneRepository, which prepares the npm
     * repository given in the npm part of yagpt.config.json.
     * see [[]]
     */
    public async prepareNpmRepository(): Promise <string | boolean> {
        const PATH_LOCAL_TARGET = UConfig.testing.path
        const PATH_LOCAL_BACKUP = UConfig.testing.npm.backupPath
        const URL_GIT = UConfig.testing.npm.git.ssh
        const OVERWRITE_IF_EXISTANT = true
        return await UGit.copyOrCloneRepository(
            PATH_LOCAL_TARGET,
            PATH_LOCAL_BACKUP,
            URL_GIT,
            OVERWRITE_IF_EXISTANT,
        )
    }

    /**
     * public checkIsSemverVersionPart
     *
     * @param
     * @returns
     * ```
     * - [ ]
     * ```
     * @TODO
     * ```
     *
     * - [ ] write comments
     * - [ ] create tests
     * - [ ] implement code
     * ```
     */
    public checkIsSemverVersionPart(
        versionPartToCheck: string,
    ): boolean | string {
        let result
        result = true
        return result
    }

}

export const UNpm = new UNpmUtility()
