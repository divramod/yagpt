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
    IResultMultiple,
    IResultOne,
    IResults,
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

    public async run(PARAMS: {
        projectPath: string,
    }): Promise<IResultMultiple> {
        console.log( // tslint:disable-line:no-console
            'running',
        )

        // SUPER runBefore()
        await super.runBefore()

        // DESTRUCT PRAMS
        const { projectPath } = PARAMS

        // INTERFACE for Task.run()
        interface INpmPublishTaskRunSubResults extends IResults {
            isGitRepository: IResultOne;
            isFeatureBranch: IResultOne;
        }

        // Initialize Results
        const RM: IResultMultiple = UCommon.getResultObjectMultiple()
        const RE: INpmPublishTaskRunSubResults = UCommon.getResultsObject([
            'isGitRepository',
            'isFeatureBranch',
            'isClean',
            'getFeatureName',
            'getFeatureIssueNumber',
            'isDevelopMergable',
        ])

        // INIT PROCEED
        let proceed = true

        // isGitRepository
        if (proceed) {
            const CHECK_IS_REPO =
                await UGit.checkIsRepo(projectPath)
            if (CHECK_IS_REPO.value) {
                RM.success = RE.isGitRepository.value = proceed = true
                RM.message = RE.isGitRepository.message = [
                    projectPath,
                    ' is a git repository!',
                ].join(' ')
            } else {
                RM.success = RE.isGitRepository.value = proceed = false
                RM.message = RE.isGitRepository.message = [
                    projectPath,
                    ' is not a git repository!',
                ].join(' ')
            }
        }

        // checkIsFeatureBranch
        if (proceed) {
            const CHECK_IS_FEATURE_BRANCH =
                await UGit.checkIsFeatureBranch(projectPath)
            if (CHECK_IS_FEATURE_BRANCH.value) {
                RM.success = RE.isFeatureBranch.value = proceed = true
                RM.message = RE.isFeatureBranch.message = [
                    projectPath,
                    ' is a feature branch!',
                ].join(' ')
            } else {
                RM.success = RE.isFeatureBranch.value = proceed = false
                RM.message = RE.isFeatureBranch.message = [
                    projectPath,
                    ' is not a feature branch!',
                ].join(' ')
            }
        }

        // isClean
        if (proceed) {
            const CHECK_IS_CLEAN =
                await UGit.checkIsClean(projectPath)
            if (CHECK_IS_CLEAN) {
                RM.success = RE.isClean.value = proceed = true
                RM.message = RE.isClean.message = [
                    projectPath,
                    ' is clean!',
                ].join(' ')
            } else {
                RM.success = RE.isClean.value = proceed = false
                RM.message = RE.isClean.message = [
                    projectPath,
                    ' is not clean!',
                ].join(' ')
            }
        }

        // get feature name and issue number
        const R_FEATURE_NAME = RE.getFeatureName.value =
        await UGit.getFeatureName(projectPath)
        const FEATURE_NAME = R_FEATURE_NAME.value
        const R_ISSUE_NUMBER = RE.getFeatureIssueNumber.value =
        await UGit.getFeatureIssueNumber(projectPath)
        const ISSUE_NUMBER = R_ISSUE_NUMBER.value

        // isDevelopMergable
        if (proceed) {

            const CHECK_IS_DEVELOP_MERGABLE =
                await UGit.checkIsMergable(
                    'develop',
                    projectPath,
                )
            if (CHECK_IS_DEVELOP_MERGABLE.value === true) {
                RM.success = RE.isDevelopMergable.value = proceed = true
                RM.message = RE.isDevelopMergable.message = [
                    'Develop mergable!',
                ].join(' ')
            } else {
                RM.success = RE.isDevelopMergable.value = proceed = false
                RM.message = RE.isDevelopMergable.message = [
                    'Develop not mergable!',
                ].join(' ')
            }
        }

        if (proceed) {
            // TODO: unlink
            // TODO: copy current directory to another place
            // TODO: change projectPath to that place
            // do the work
            // TODO: update master, develop, feature in current path

            const GIT = GIT_P(projectPath)

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
                PATH.resolve(projectPath, 'package.json'),
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
            SHELL.cd(projectPath)
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
            console.log( // tslint:disable-line:no-console
                'projectPath',
                projectPath,
            )
            SHELL.cd(projectPath)
            SHELL.exec('npm publish', { silent: false })
            SHELL.cd(PATH_BEFORE)

            console.log( // tslint:disable-line:no-console
                'after publish',
            )
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
        }

        // SET RM RE
        RM.results = RE

        // SUPER runAfter()
        await super.runAfter()

        // RETURN
        return RM
    }

}
