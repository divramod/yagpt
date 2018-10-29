export class NpmTask {

    public run(task: string): boolean {
        console.log( // tslint:disable-line:no-console
            'task',
            task,
        )
        return true
    }

}
export const Npm = new NpmTask()
