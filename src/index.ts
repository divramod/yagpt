const path = require('path')
const shell = require('shelljs')
const program = require('commander')

import { ITest } from '@typings/index'
import { ask } from '@utils/index'
import { promptDmTpl } from '@utils/index'
import { promptJobs } from '@utils/index'
import { promptProjects } from '@utils/index'

// TODO: decide between cli and programatically usage
program
    .version('0.0.1')
    .option('-p, --path [type]', 'parse path [???/jobs/???/jobs/???]')
    .parse(process.argv)

/**
 * main(PROGRAM)
 * - [ ] if job at --path existent run job
 * - [ ] if --path links to a jobs directory run prompt for that directory
 * - [ ] if --path not existant run project prompt (package.json project)
 * - [ ] if --path not existant && package.json project existant run dmTpl Prompt
 */
async function main(PROGRAM) {
    let result = {}
    const CWD = await shell.pwd()
    let packageJsonExists = false
    let packageJson = {
        projects: [],
    }
    if (await shell.test('-f', path.join(CWD.toString(), 'test/exampleFiles/package.json'))) {
        packageJsonExists = true
        packageJson = require('test/exampleFiles/package.json')
        console.log('in') // tslint:disable-line:no-console
    }

    // if PROGRAM.path existant
    if (PROGRAM.path) {

        const JOBS_PATH = path.join(CWD.toString(), PROGRAM.path, 'jobs')
        const JOBS_PATH_EXISTANT = await shell.test('-d', JOBS_PATH)

        if (JOBS_PATH_EXISTANT) {
            // 1. if --path is prompt (has jobs directory) run prompt
            await promptJobs(JOBS_PATH)
        } else if (!JOBS_PATH_EXISTANT && 1) {
            // TODO: 2. else if path has single job
            const JOB_PATH = path.join(CWD.toString(), PROGRAM.path, 'index')
            const JOB: any = await import(JOB_PATH)
            result = await JOB.run()
        } else {
            // 3. else if --path not existant (no job or no prompt (/jobs-directory))
            console.log('No job existant at ', PROGRAM.path) // tslint:disable-line:no-console
        }

    } else { // if PROGRAM.path not existant

        // project > src/jobs > dmTpl
        if ( packageJsonExists && packageJson.projects.length > 0) {
            // 1. if package.json projects are existant
            const JOB_PATH = await promptProjects(packageJson.projects)
        } else if (await shell.test('-d', path.join(CWD.toString(), 'src', 'jobs'))) {
            // 2. if directory has src/jobs directory
            await promptJobs(path.join(CWD.toString(), 'src', 'jobs'))
            // const CHOICES = [ 'test-1', 'test-2' ]
            // const QUESTIONS = [ { type: 'list', name: 'menu', message: '', choices: CHOICES } ]
            // await ask(QUESTIONS)

        } else {
            // TODO: 3. if directory is virgin (no src/jobs && no config.json with projects)
            // - run global dmTpl
            const JOBS_PATH = path.join(CWD.toString(), PROGRAM.path, 'jobs')
            await promptDmTpl()
            // TODO if directory is npm repo add npm jobs
            // TODO if directory is git repo add git jobs
        }
    }
}

// RUN
main(program)
