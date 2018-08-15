export interface IUtilsSubResult {
    msg: string | undefined;
    success: boolean | undefined;
    error: any;
    value: any;
}

export interface IUtilsTaskResults {
    [key: string]: IUtilsSubResult;
}

export interface IUtilsResult {
    results: IUtilsTaskResults;
    success: boolean;
    value: any;
    options?: any;
}

export interface IUtilsInput {
    message: string;
    success: boolean;
    value: any
}
