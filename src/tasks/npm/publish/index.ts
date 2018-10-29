import { UGit } from '@utils/nodejs/git'
import { UJson } from '@utils/nodejs/json'
const GIT_P = require('simple-git/promise')
const SEMVER = require('semver')
const SHELL = require('shelljs')
const PATH = require('path')
import {
    ITaskClass,
    ITaskConstructorParams,
    SuperTask,
} from '@utils/nodejs/task/index'

// CLASS Task
export class Task extends SuperTask implements ITaskClass {

    constructor(opts: ITaskConstructorParams) {
        super({
            cwd: opts.cwd,
            logging: opts.logging || false,
            name: 'Npm Publish',
        })
    }

    public async isRunnable(PARAMS: {
        PROJECT_PATH: string,
    }): Promise<any> {
        const { PROJECT_PATH } = PARAMS
        const R = {
            isClean: undefined,
            isDevelopMergable: undefined,
            isFeatureBranch: undefined,
            isGitRepository: undefined,
            value: undefined,
        }
        const branchName = await UGit.getBranchName(PROJECT_PATH)
        R.isGitRepository = await UGit.checkIsRepo(PROJECT_PATH)
        R.isFeatureBranch = await UGit.checkIsFeatureBranch(PROJECT_PATH)
        R.isClean = await UGit.checkIsClean(PROJECT_PATH)
        R.isDevelopMergable = await UGit.checkIsMergableFromTo(
            PROJECT_PATH,
            'develop',
        )
        R.value = true
        for (const prop in R) {
            if (prop.indexOf('is') === 0) {
                if (R[prop] !== true) {
                    R.value = false
                }
            }
        }
        return R
    }

    public async run(PARAMS: {
        PROJECT_PATH: string,
    }): Promise<any> {
        await super.runBefore()
        const { PROJECT_PATH } = PARAMS
        const IS_RUNNABLE = await this.isRunnable(PARAMS)
        const R = {
            isRunnable: IS_RUNNABLE,
            value: undefined,
        }
        if (R.isRunnable.value === true) {
            // get feature name and issue number
            const FEATURE_NAME =
                await UGit.getFeatureName(PROJECT_PATH)
            const ISSUE_NUMBER =
                await UGit.getFeatureIssueNumber(PROJECT_PATH)
            const GIT = GIT_P(PROJECT_PATH)
            await GIT.raw([
                'fetch',
                'origin',
                'develop',
            ])
            await GIT.raw([
                'merge',
                '-m',
                'MERGE DEVELOP"',
                'origin/develop',
            ])
            await GIT.raw([
                'checkout',
                'develop',
            ])
            const FEATURE_FULL_NAME = [
                'feature/',
                ISSUE_NUMBER,
                '-',
                FEATURE_NAME,
            ].join('')
            await GIT.raw([
                'merge',
                FEATURE_FULL_NAME,
            ])
            await GIT.raw([
                'push',
                '-u',
                'origin',
                'HEAD',
            ])
            // TODO git checkout release/0.1.1
            const R_CURRENT_VERSION_NUMBER = UJson.getKeyValueFromFile(
                PATH.resolve(PROJECT_PATH, 'package.json'),
                'version',
            )
            const CURRENT_VERSION_NUMBER = R_CURRENT_VERSION_NUMBER.value
            const NEXT_VERSION_NUMBER =
                SEMVER.inc(CURRENT_VERSION_NUMBER, 'patch')
            const FULL_RELEASE_NAME = 'release/' + NEXT_VERSION_NUMBER
            await GIT.raw([
                'checkout',
                '-b',
                FULL_RELEASE_NAME,
            ])
            // bump version number in package.json
            const PATH_BEFORE = process.cwd()
            SHELL.cd(PROJECT_PATH)
            SHELL.exec('npm version patch', { silent: true })
            SHELL.cd(PATH_BEFORE)
            // git add -A
            await GIT.raw([
                'add',
                '-A',
            ])
            // git commit -m "RELEASE 0.1.1"
            const FULL_RELEASE_MESSAGE = [
                '-m',
                '"RELEASE ' + NEXT_VERSION_NUMBER + '"',
            ].join(' ')
            await GIT.raw([
                'commit',
                FULL_RELEASE_MESSAGE,
            ])
            // checkout develop
            await GIT.raw([
                'checkout',
                'develop',
            ])
            // merge release into develop
            await GIT.raw([
                'merge',
                FULL_RELEASE_NAME,
            ])
            // push -u origin HEAD
            await GIT.raw([
                'push',
                '-u',
                'origin',
                'HEAD',
            ])
            // checkout master
            await GIT.raw([
                'checkout',
                'master',
            ])
            // merge release into develop
            await GIT.raw([
                'merge',
                FULL_RELEASE_NAME,
            ])
            // push -u origin HEAD
            await GIT.raw([
                'push',
                '-u',
                'origin',
                'HEAD',
            ])
            // publish
            SHELL.cd(PROJECT_PATH)
            SHELL.exec('npm publish', { silent: true })
            SHELL.cd(PATH_BEFORE)
            // push tags
            await GIT.raw([
                'push',
                '--tags',
            ])
            // push -u origin HEAD
            await GIT.raw([
                'branch',
                '-D',
                FULL_RELEASE_NAME,
            ])
            // checkout feature
            await GIT.raw([
                'checkout',
                FEATURE_FULL_NAME,
            ])
            // merge develop into feature
            await GIT.raw([
                'merge',
                'develop',
            ])
            // push -u origin HEAD
            await GIT.raw([
                'push',
                '-u',
                'origin',
                'HEAD',
            ])
            R.value = true
            await super.runAfter()
        } else {
            R.value = false
        }
        return R
    }

}
