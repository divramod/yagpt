// Task
// ========================================================
export interface ITaskConstructorParams {
    cwd: string;
    logging?: boolean;
}

export interface ITaskClass {
    run();
}

export interface ITaskRunSubResult {
    msg?: string | undefined;
    success: boolean;
    error?: any;
    value?: any;
}

export interface ITaskRunSubResults {
    [key: string]: ITaskRunSubResult;
}

export interface ITaskRunResult {
    results: ITaskRunSubResults;
    success?: boolean;
    value?: any;
    options?: any;
}

// SuperTask
// ========================================================
export interface ISuperTaskConstructorParams {
    cwd: string;
    logging: boolean;
    name: string;
}

export interface ISuperTaskLogValueColorTheme {
    description: [string];
    value: any;
}

export interface ISuperTaskLogHeaderColorTheme {
    devider: [string];
    value: any;
}
