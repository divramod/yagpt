// https://gitlab.com/divramod/yagpt/issues/7

// IMPORT
import { UCommon } from '@utils/nodejs/common'
import { UGit } from '@utils/nodejs/git'
import { UJson } from '@utils/nodejs/json'

// REQUIRE
const GIT_P = require('simple-git/promise')
const SEMVER = require('semver')
const SHELL = require('shelljs')
const PATH = require('path')

// TYPINGS / SuperTask
import {
    IResult,
} from '@utils/nodejs/common'
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
    }): Promise<IResult> {
        // DESTRUCT PRAMS
        const { PROJECT_PATH } = PARAMS

        // Prepare Result
        const R: IResult = {
            error: undefined,
            message: undefined,
            subresults: {
                isClean: {
                    error: undefined,
                    message: undefined,
                    value: undefined,
                },
                isDevelopMergable: {
                    error: undefined,
                    message: undefined,
                    value: undefined,
                },
                isFeatureBranch: {
                    error: undefined,
                    message: undefined,
                    value: undefined,
                },
                isGitRepository: {
                    error: undefined,
                    message: undefined,
                    value: undefined,
                },
            },
            value: undefined,
        }

        // PREPARE proceed
        let proceed = true

        // TEST

        // isGitRepository
        if (proceed) {
            const CHECK_IS_REPO =
                await UGit.checkIsRepo(PROJECT_PATH)
            if (CHECK_IS_REPO === true) {
                R.value = R.subresults.isGitRepository.value = proceed = true
                R.message = R.subresults.isGitRepository.message = [
                    PROJECT_PATH,
                    ' is a git repository!',
                ].join(' ')
            } else {
                R.value = R.subresults.isGitRepository.value = proceed = false
                R.message = R.subresults.isGitRepository.message = [
                    PROJECT_PATH,
                    ' is not a git repository!',
                ].join(' ')
            }
        }

        // isFeatureBranch
        if (proceed) {
            const CHECK_IS_FEATURE_BRANCH =
                await UGit.checkIsFeatureBranch(PROJECT_PATH)
            if (CHECK_IS_FEATURE_BRANCH === true) {
                R.value = R.subresults.isFeatureBranch.value = proceed = true
                R.message = R.subresults.isFeatureBranch.message = [
                    PROJECT_PATH,
                    ' is a feature branch!',
                ].join(' ')
            } else {
                R.value = R.subresults.isFeatureBranch.value = proceed = false
                R.message = R.subresults.isFeatureBranch.message = [
                    PROJECT_PATH,
                    ' is not a feature branch!',
                ].join(' ')
            }
        }

        // isClean
        if (proceed) {
            const CHECK_IS_CLEAN =
                await UGit.checkIsClean(PROJECT_PATH)
            if (CHECK_IS_CLEAN) {
                R.value = R.subresults.isClean.value = proceed = true
                R.message = R.subresults.isClean.message = [
                    PROJECT_PATH,
                    ' is clean!',
                ].join(' ')
            } else {
                R.value = R.subresults.isClean.value = proceed = false
                R.message = R.subresults.isClean.message = [
                    PROJECT_PATH,
                    ' is not clean!',
                ].join(' ')
            }
        }

        // isDevelopMergable
        if (proceed) {
            const CHECK_IS_DEVELOP_MERGABLE =
                await UGit.checkIsMergableFromTo(
                    PROJECT_PATH,
                    'develop',
                )
            if (CHECK_IS_DEVELOP_MERGABLE === true) {
                R.value = R.subresults.isDevelopMergable.value = proceed = true
                R.message = R.subresults.isDevelopMergable.message = [
                    'Develop mergable!',
                ].join(' ')
            } else {
                R.value = R.subresults.isDevelopMergable.value = proceed = false
                R.message = R.subresults.isDevelopMergable.message = [
                    'Develop not mergable!',
                ].join(' ')
            }
        }

        // RETURN RESULT
        return R
    }

    public async run(PARAMS: {
        PROJECT_PATH: string,
    }): Promise<IResult> {

        // SUPER runBefore()
        await super.runBefore()

        // DESTRUCT PRAMS
        const { PROJECT_PATH } = PARAMS

        // PREPARE RESULT
        const R: IResult = {
            error: undefined,
            message: undefined,
            subresults: {
            },
            value: undefined,
        }

        // get feature name and issue number
        const FEATURE_NAME =
            await UGit.getFeatureName(PROJECT_PATH)
        const ISSUE_NUMBER =
            await UGit.getFeatureIssueNumber(PROJECT_PATH)

        // TODO: unlink
        // TODO: copy current directory to another place
        // TODO: change projectPath to that place
        // do the work
        // TODO: update master, develop, feature in current path
        const GIT = GIT_P(PROJECT_PATH)

        // merge (git fetch origin develop)
        await GIT.raw([
            'fetch',
            'origin',
            'develop',
        ])
        // merge (git merge -m "test" origin/develop)
        await GIT.raw([
            'merge',
            '-m',
            'MERGE DEVELOP"',
            'origin/develop',
        ])
        // checkout develop
        await GIT.raw([
            'checkout',
            'develop',
        ])
        // merge feature
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
        // push -u origin HEAD
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
        SHELL.exec('npm publish', { silent: false })
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

        // unlink
        // SHELL.cd(projectPath)
        // SHELL.exec('sudo npm rm --global ', { silent: false })
        // SHELL.cd(PATH_BEFORE)

        // SUPER runAfter()
        await super.runAfter()

        // RETURN
        return R
    }

}
