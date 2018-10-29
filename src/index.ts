import { UTest } from '@utils/nodejs/test'

/**
 *
 */
// TODO
// - define how to know if program is run from cli or programatically
export async function main(): Promise<boolean> {
    let mainRun = false
    if (UTest.getEnv() !== 'testing') {
        // const G = './tasks/npm/publish'
        // const TASK_IMPORT = await import(G)
        // const TASK_CLASS = TASK_IMPORT.Task
        // const TASK = new TASK_CLASS(__dirname)
        // const R_TASK = await TASK.run({projectPath: process.cwd()})
        mainRun =  true
    }
    return mainRun
}

/**
 *
 */
main()
console.log( // tslint:disable-line:no-console
    'hello',
)
