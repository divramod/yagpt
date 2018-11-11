const FS = require('fs')
const PATH = require('path')
const SHELL = require('shelljs')
const RIMRAF = require('rimraf')
const GIT_P = require('simple-git/promise')

import { UJson } from '@utils/nodejs/json'

/**
 *
 */
// TODO
// - createConfigFileAtPath(path, values, ???)
// - initConfigurationFromExample(examplePath, targetPath)
// - how to document the format (mandatory/not mandatory configs)
export class UConfigUtility {
    public configPath: string
    public config: any
    public testing: any
    public testPath: string

    /**
     * @thoughts-on-config-cases
     *      1. testing the yagpt package himself (uses yagpt.config.json
     *         standard or self?)
     *      2. testing a package which uses yagpt.config.json
     * @returns
     *      1. configJsonPath===undefined currentPathHasYagptConfigJson===true
     *      2. configJsonPath===undefined currentPathHasYagptConfigJson===false
     *          search for user .yagpt.config.json (/home/user)
     *          search for global yagpt.config.json (global-modules-path)
     *              test if installed globally
     *      3. configJsonPath===string configJsonPath
     *         path to file existant
     *         name === yagpt.config.json or .yagpt.config.json
     *         file has correct yagptConfigFileFormat
     */
    constructor(
        configJsonPath?: string,
    ) {
        this.config = UJson.getKeyValueFromFile(
            PATH.resolve(
                process.cwd(),
                'yagpt.config.json',
            ),
        )
        this.testing = UJson.getKeyValueFromFile(
            PATH.resolve(
                process.cwd(),
                'yagpt.config.json',
            ),
            'testing',
        )
        this.testPath = PATH.resolve(
            this.testing.path,
        )
        this.configPath = PATH.resolve(
            require('global-modules-path').getPath('yagpt'),
            'yagpt.config.json',
        )
        return this
    }

}

export const UConfig = new UConfigUtility()
