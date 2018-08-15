const path = require('path')

const shell = require('shelljs')
const program = require('commander')

// import { ITest } from '@typings/index'
import { promptAsk } from '@utils/prompt/index'
import { promptDmTpl } from '@utils/prompt/index'
import { promptJobs } from '@utils/prompt/index'
import { promptProjects } from '@utils/prompt/index'
// import { promptProjects } from '@utils/prompt/index'
// import { promptProjects } from './utils/prompt/projects'

// export async function main() {
// const JOB_PATH = path.join('./jobs/devops/jobs/git/jobs/releasePublish/index')
// const JOB: any = await import(JOB_PATH)
// const RESULT = await JOB.run()
// }

export async function main() {
    const G = './utils/test/test1'
    const TASK_IMPORT = await import(G)
    const TASK_CLASS = TASK_IMPORT.Task
    const TASK = new TASK_CLASS(__dirname)
    const R_TASK = TASK.run()
}

// RUN IF NOT TESTING
const PROCESS_ENV = process.env.DM_TPL_ENV
if (PROCESS_ENV !== 'testing') {
    main()
}
