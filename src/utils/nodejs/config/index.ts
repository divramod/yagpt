const FS = require('fs')
const PATH = require('path')
const SHELL = require('shelljs')
const RIMRAF = require('rimraf')
const GIT_P = require('simple-git/promise')

import { UJson } from '@utils/nodejs/json'

export class UConfigUtility {

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

}

export const UConfig = new UConfigUtility()
