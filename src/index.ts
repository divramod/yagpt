import { UTest } from '@utils/nodejs/test'

export async function main(): Promise<boolean> {
    let mainRun = false
    if (UTest.getEnv() !== 'testing') {
        const G = './tasks/npm/publish'
        const TASK_IMPORT = await import(G)
        const TASK_CLASS = TASK_IMPORT.Task
        const TASK = new TASK_CLASS(__dirname)
        const R_TASK = TASK.run({projectPath: __dirname})
        mainRun =  true
    }
    return mainRun
}

main()

export { describe, expect, it, UTest } from '@utils/nodejs/test'
