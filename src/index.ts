import { UTest } from '@utils/nodejs/test'
const pathToPackage = require('global-modules-path').getPath('yagpt')

export async function main(): Promise<boolean> {
    let mainRun = false
    if (UTest.getEnv() !== 'testing') {
        const G = './tasks/npm/publish'
        const TASK_IMPORT = await import(G)
        const TASK_CLASS = TASK_IMPORT.Task
        const TASK = new TASK_CLASS(__dirname)
        const R_TASK = await TASK.run({projectPath: process.cwd()})
        console.log( // tslint:disable-line:no-console
            'R_TASK',
            R_TASK,
        )
        mainRun =  true
    }
    return mainRun
}
main()

export { describe, expect, it, UTest } from '@utils/nodejs/test'
