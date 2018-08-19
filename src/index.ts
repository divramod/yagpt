import { UTest } from '@utils/nodejs/test'

export async function main() {
    let mainRun = false
    if (UTest.getEnv() !== 'testing') {
        const G = './tasks/npm/publish'
        const TASK_IMPORT = await import(G)
        const TASK_CLASS = TASK_IMPORT.Task
        const TASK = new TASK_CLASS(__dirname)
        const R_TASK = TASK.run()
        mainRun =  true
        console.log('i am running') // tslint:disable-line:no-console
    }
    return mainRun
}

main()
