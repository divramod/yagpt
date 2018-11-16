import { TNpmPublish } from '@tasks/system/npm/publish'
import { IModule } from '@utils/yagpt/module'

/**
 * @TODO
 * ```
 *
 * - [ ] getPrompt()
 * - [ ] getProgram()
 * ```
 */
export class NpmTaskModule implements IModule {

    /**
     * public getPrompt
     *
     * @param
     * @returns
     * ```
     * - [ ]
     * ```
     * @TODO
     * ```
     *
     * - [ ] write comments
     * - [ ] create tests
     * - [ ] implement code
     * ```
     */
    public getPrompt(): boolean | string {
        let result
        result = true
        return result
    }

    /**
     * public getProgram()
     *
     * @param
     * @returns
     * ```
     * - [ ]
     * ```
     * @TODO
     * ```
     *
     * - [ ] write comments
     * - [ ] create tests
     * - [ ] implement code
     * ```
     */
    public getProgram(): boolean | string {
        let result
        result = true
        return result
    }

}
export const Npm = new NpmTaskModule()
