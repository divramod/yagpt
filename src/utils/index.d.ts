/**
 * @param runsOn  The platforms, on which the utility runs on.
 */
interface IUtility {
    runsOn: string[];
}

/**
 *
 */
interface ITool {
    install(): Promise<boolean | string>;
}
