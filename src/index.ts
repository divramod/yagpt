import { UTest } from '@utils/nodejs/test'

export async function main() {
    const U_TEST = UTest.getInstance()
    let mainRun = false
    if (U_TEST.getEnv() !== 'testing') {
        const G = './tasks/npm/publish'
        const TASK_IMPORT = await import(G)
        const TASK_CLASS = TASK_IMPORT.Task
        const TASK = new TASK_CLASS(__dirname)
        const R_TASK = TASK.run()
        mainRun =  true
    }
    return mainRun
}

main()
