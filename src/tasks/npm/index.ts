import { TNpmPublish } from '@tasks/npm/publish'
export class NpmTask {
    public async run(task: string): Promise<any> {
        let result
        if (task === 'publish') {
            const TASK = new TNpmPublish(process.cwd())
            result = await TASK.runTask()
            console.log( // tslint:disable-line:no-console
                'result',
                result,
            )
        }
        return result
    }
}
export const Npm = new NpmTask()
