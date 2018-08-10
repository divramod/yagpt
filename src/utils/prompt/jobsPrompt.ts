const shell = require('shelljs')
import * as path from 'path'
const inquirer = require('inquirer')
import { sortBy } from 'underscore'

/**
 * runJobsPrompt
 * - TODO
 */
export async function runJobsPrompt(JOBS_PATH) {
    const JOBS_ARR = await getJobsRecursively(JOBS_PATH)
    const JOB_CHOICE = await createMenu(JOBS_ARR)
    console.log('JOB_CHOICE', JOB_CHOICE) // tslint:disable-line:no-console
}

/**
 * createMenu
 * - TODO
 */
async function createMenu(JOBS_ARR) {
    // TODO: add seperator
    // TODO: add quit
    // TODO: add back
    const Q = [
        { type: 'list', name: 'menu', message: '', choices: JOBS_ARR },
    ]
    const CHOICE = await inquirer.prompt(Q)
    const PATH = CHOICE.menu
    const SUBMENU_PATH = path.join(CHOICE.menu, 'jobs')
    let job = ''
    if (await shell.test('-d', path.join(PATH, 'jobs'))) {
        const JOBS_ARR_SUBMENU = await getJobsRecursively(SUBMENU_PATH)
        job = await createMenu(JOBS_ARR_SUBMENU)
    } else {
        job = PATH
    }
    return job
}

/**
 * getJobsRecursively
 */
async function getJobsRecursively(JOBS_PATH) {
    let jobs = []
    const FILES_IN_JOBS_DIRECTORY = await shell.find(JOBS_PATH)
    for (const FILE of FILES_IN_JOBS_DIRECTORY) {
        if (JOBS_PATH !== FILE) {
            const MINUS_JOBS_PATH = FILE.substring(JOBS_PATH.length + 1, FILE.length)
            const IS_DIRECTORY = await shell.test('-d', FILE)
            const ENDS_WITH_JOBS = FILE.substring(FILE.length - 4, FILE.length)
            if (IS_DIRECTORY && ENDS_WITH_JOBS !== 'jobs' && MINUS_JOBS_PATH.indexOf('/') === -1) {
                if (await shell.test('-d', path.join(FILE, 'jobs'))) {
                    const NAME = FILE.substring(FILE.lastIndexOf('/') + 1, FILE.length)
                    jobs.push({
                        name: NAME.toUpperCase(),
                        path: FILE,
                        type: 'submenu',
                        value: FILE,
                    })
                } else {
                    jobs.push({
                        name: FILE.substring(FILE.lastIndexOf('/') + 1, FILE.length),
                        path: FILE,
                        type: 'job',
                        value: FILE,
                    })
                }
            }
        }
    }
    jobs = sortBy(sortBy(jobs, 'name').reverse(), 'type').reverse()
    return jobs
}
