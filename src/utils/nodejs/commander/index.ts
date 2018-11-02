const program = require('commander')
import { Npm } from '@tasks/npm'
import { UPath } from '@utils/nodejs/path'

/**
 * This class is the major class for the cli of the yagpt package.
 * It will parse the command line options given to the yagpt package alias.
 *
 * EXAMPLES: The following commands will do the same, they run the task publish
 * from the npm task-module:
 * ```
 * // invocation from main package alias
 * ya npm publish --src . --semver minor
 * yagpt npm publish --src . --semver minor
 * ```
 *
 * STRUCTURE: The abstract structure of a command looks the following way:
 * ```
 * yagpt npm publish --src . --semver minor
 * // yagpt: the system wide alias for the package
 * // npm: choosing the task-module npm
 * // publish: choosing the task
 * // --src .: setting the src option for the task. . means current directory
 * // --semver minor: defines, which part of the version should be incremented
 * ```
 * OPTIONS: Every task can have a number of different options, which can be
 * passed to it. The short-flags (for example -s) can be freely choosen with
 * the exception of the following flags, which are used for general purposes:
 * -h (for --help)
 * -l (for --log)
 *
 * OPTIONS-ORDERING: The order of the options isn't mandatory
 *
 * CASES: There are different ways to run a task you want:
 * ```
 * // 0 run the task explicitly
 * yagpt npm publish --src . --semver minor
 *
 * // 3 run the module prompt and go to the task
 * yagpt npm
 *
 * // 2 print the module help
 * yagpt npm -h
 * yagpt npm someNotExistantTask
 *
 * // 1 run yagpt general prompt
 * yagpt
 *
 * // 4 print general help
 * yagpt -h
 * yagpt someNotExistantModule
 *
 * ```
 *
 * @TODO
 * ```
 *
 * - [ ] use cmd options for program
 * - [ ] create example prompt for npm module
 * - [ ] fu: parseTask()
 * - [ ] fu: getProgram()
 * - [ ] fu: constructProgram()
 * - [ ] fu: runTask()
 * - [ ] rename to CliUtility()
 * - [ ] THINK: would it be good to be able to create different programs (yes,
 *              i think so, so it would be important to pass the program
 *              options, cmds etc)
 * - [ ] create script for automatically creating the sh aliases
 * - [ ] rename nodejs directory to yagpt directory and replace the utils path
 *       in tsconfig.json
 * - [ ] introduce options parameter (the first one is always the task
*       (--template --src (has some documented standards . (current dir),
            *       home (home dir), test (test dir), ...)
        * - [ ] test pathes
        *   - [ ] is project
        *   - [ ] is app
        *   - [ ] is module
        * ```
        */
export class UCommanderUtility {

                    /**
                     * The commander program, which holds all the options which can be passed
                     * to the alias.
                     */
                    private program: any

                    private moduleProgram: any

                    /**
                     * @TODO
                     * ```
                     *
                     * - [ ] comment
                     * ```
                     */
                    constructor() {
                        this.program =
                            program
                            .version('0.1.0')
                            .command('<module> [task]')
                            .parse(process.argv)

                    }

                    /**
                     * Runs the command line utility.
                     * @returns
                     * Return the result of a task.
                     * @TODO
                     * ```
                     *
                     * - [ ] create test
                     * - [ ] extract module
                     * - [ ] extract task
                     * - [ ] check if module task exists, if not return module help
                     * - [ ] import module task program (every task has other options)
                     * ```
                     */
                    public run(): boolean {
                        const args = this.program.args
                        const module = args[0]
                        const task = args[1]
                        const R_CHECK_IF_MODULE_TASK_EXISTANT = this.checkIfModuleTaskExistant(
                            module,
                            task,
                        )
                        switch (R_CHECK_IF_MODULE_TASK_EXISTANT) {
                            case 0: {
                                // 0 runTask()
                                break
                            }
                            case 1: {
                                // 1 runYagptPrompt()
                                break
                            }
                            case 2: {
                                // 2 printModuleHelp()
                                break
                            }
                            case 3: {
                                // 3 runModulePrompt()
                                break
                            }
                            case 4: {
                                // 4 printGeneralHelp()
                                break
                            }
                            default: {
                                break
                            }
                        }
                        // this.moduleProgram =
                        // program
                        // .option('-s, --src [path]', 'Src')
                        // .option('-t, --test [path]', 'Test')
                        // .parse(process.argv)
                        return true
                    }

                    /**
                     * checkIfModuleTaskExistant()
                     *
                     * Checks if the commands (module, task) given to the program are in
                     * existence in order to find out, what to do.
                     * @param module  The given module.
                     * @param task  The given task.
                     * @returns
                     * ```
                     * - 0 runTask()
                     *   - MODULE_EXISTS=true
                     *   - TASK_EXISTS=true
                     * - 1 runYagptPrompt()
                     *   - MODULE_DEFINED=false
                     * - 2 printModuleHelp()
                     *   - MODULE_DEFINED=true
                     *   - MODULE_EXISTS=true
                     *   - TASK_DEFINED=true
                     *   - TASK_EXISTS=false
                     * - 3 runModulePrompt()
                     *   - MODULE_DEFINED=true
                     *   - MODULE_EXISTS=true
                     *   - TASK_DEFINED=false
                     * - 4 printGeneralHelp()
                     *   - MODULE_DEFINED=true
                     *   - MODULE_EXISTS=false
                     * ```
                     */
                    public checkIfModuleTaskExistant(
                        module?: string,
                        task?: string,
                    ): number {
                        let result

                        // construct pathes
                        const MODULE_PATH = [
                            process.cwd(),
                            'src',
                            'tasks',
                            module,
                        ].join('/')
                        const TASK_PATH = [
                            MODULE_PATH,
                            task,
                        ].join('/')

                        // check conditions
                        const TASK_EXISTS = UPath.checkIfPathIsDirectory(
                            TASK_PATH,
                        )
                        const MODULE_EXISTS =
                            UPath.checkIfPathIsDirectory(MODULE_PATH)
                        const MODULE_DEFINED = (module !== undefined)
                        const TASK_DEFINED = (task !== undefined)

                        // construct result
                        if (MODULE_EXISTS === true && TASK_EXISTS === true) {
                            result = 0
                        }
                        if (MODULE_DEFINED === false) {
                            result = 1
                        }
                        if ( MODULE_DEFINED === true
                            && MODULE_EXISTS === true
                            && TASK_DEFINED === true
                            && TASK_EXISTS === false
                        ) {
                            result = 2
                        }

                        if (MODULE_DEFINED === true
                            && MODULE_EXISTS === true
                            && TASK_DEFINED === false
                        ) {
                            result = 3
                        }
                        if ( MODULE_DEFINED === true
                            && MODULE_EXISTS === false
                        ) {
                            result = 4
                        }

                        // return
                        return result
                    }

                    /**
                     * Returns the commander program, created by the class.
                     * @param print  Says if the program should be printed to the cli. This is
                     * mainly for helping understanding commander.
                     * @returns  The program which contains the cli options.
                     * @TODO
                     * ```
                     *
                     * - [ ]
                     * ```
                     */
                    public getProgram(
                        print: boolean = false,
                    ): boolean {
                        if (print === true) {
                            console.log( // tslint:disable-line:no-console
                                'this.program',
                                this.program,
                            )
                        }
                        return this.program
                    }

                    /**
                     * Constructs the programm with all options.
                     * @param options  The options for the program
                     * @returns
                     * @TODO
                     * ```
                     *
                     * - [ ]
                     * ```
                     */
                    public constructProgram(
                        options: any,
                    ): boolean | string {
                        let result
                        result = true
                        return result
                    }

                }
export const UCommander = new UCommanderUtility()
