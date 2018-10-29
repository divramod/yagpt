import { TNpmPublish } from '@tasks/npm/publish'
export class NpmTask {
    public async run(task: string): Promise<any> {
        let result
        if (task === 'publish') {
            console.log( // tslint:disable-line:no-console
                'task',
                task,
            )
            result = await TNpmPublish.run({
                PROJECT_PATH: process.cwd(),
            })
            console.log( // tslint:disable-line:no-console
                'result',
                result,
            )
        }
        return result
    }
}
export const Npm = new NpmTask()
