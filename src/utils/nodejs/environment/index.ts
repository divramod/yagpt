export class EnvironmentUtility {

    /**
     * Returns the environment variable of the module.
     * @returns  [testing|development|production]
     */
    public getEnv(): string {
        return process.env.DMTPL_ENV
    }

}
export const UEnvironment = new EnvironmentUtility()
