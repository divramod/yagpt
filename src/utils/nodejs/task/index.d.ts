// Task
// ========================================================
export interface ITaskConstructorParams {
    cwd: string;
    logging?: boolean;
}

export interface ITask {
    run(projectPath: string): Promise<any>;
    isRunnable();
}

// SuperTask
// ========================================================
export interface ISuperTaskConstructorParams {
    cwd: string;
    logging?: boolean;
    name: string;
    testing?: boolean;
}

export interface ISuperTaskLogValueColorTheme {
    description: [string];
    value: any;
}

export interface ISuperTaskLogHeaderColorTheme {
    devider: [string];
    value: any;
}
