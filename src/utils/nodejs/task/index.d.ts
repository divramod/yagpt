export interface ITask {
    runSteps(): Promise<any>;
    checkPrerequisites(): Promise<any>;
}
