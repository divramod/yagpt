const programCommander = require('commander')
const PATH = require('path')
import { UEnvironment } from '@utils/nodejs/environment'
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
 * - [ ] use cmd options for programCommander
 * - [ ] create example prompt for npm module
 * - [ ] fu: parseTask()
 * - [ ] fu: getPackageProgram()
 * - [ ] fu: constructProgram()
 * - [ ] fu: runTask()
 * - [ ] rename to CliUtility()
 * - [ ] THINK: would it be good to be able to create different programs (yes,
 *              i think so, so it would be important to pass the
 *              programCommander options, cmds etc)
 * - [ ] create script for automatically creating the sh aliases
 * - [ ] rename nodejs directory to yagpt directory and replace the utils path
 *       in tsconfig.json
 * - [ ] introduce options parameter (the first one is always the task
 *       (--template --src (has some documented standards . (current dir),
 *       home (home dir), test (test dir), ...)
 * - [ ] test pathes: is project, is app, is module
 * ```
 */
export class UPackageUtility {

    /**
     * Runs the command line utility.
     * @returns
     * Return the result of a task.
     * @TODO
     * ```
     *
     * - [ ] write comments
     * - [ ] create test
     * ```
     */
    public async run(): Promise<boolean> {
        const args = this.getPackageProgram().args
        const module = args[0]
        const task = args[1]
        const R_CHECK_IF_MODULE_TASK_EXISTANT = this.parseProgramArguments(
            module,
            task,
        )
        switch (R_CHECK_IF_MODULE_TASK_EXISTANT) {
            case 0: {
                // 0 runTask()
                if (UEnvironment.getEnv() !== 'testing') {
                    const TASK_PATH = PATH.resolve(
                        '.',
                        'src',
                        'tasks',
                        module,
                        task,
                    )
                    // const G = PATH.resolve('./src/tasks/npm/publish')
                    const G = PATH.resolve(TASK_PATH)
                    const TASK_IMPORT = await import(G)
                    const TASK_CLASS = TASK_IMPORT.Class
                    const TASK = new TASK_CLASS()
                    const R_TASK = await TASK.runTask()
                    console.log( // tslint:disable-line:no-console
                        'R_TASK',
                        R_TASK,
                    )
                }
                break
            }
            case 1: {
                // 1 runPackagePrompt()
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
                // 4 printPackageHelp()
                break
            }
            default: {
                break
            }
        }
        return true
    }

    /**
     * parseProgramArguments()
     *
     * Checks if the commands (module, task) given to the programCommander are
     * in existence in order to find out, what to do.
     * @param module  The given module.
     * @param task  The given task.
     * @returns
     * ```
     * - 0 runTask()
     *   - MODULE_EXISTS=true
     *   - TASK_EXISTS=true
     *   - TODO OPTION_HELP_PASSED=false
     * - 1 runPackagePrompt()
     *   - MODULE_DEFINED=false
     * - 2 printModuleHelp()
     *   - 1 wrong usage
     *     - MODULE_DEFINED=true
     *     - MODULE_EXISTS=true
     *     - TASK_DEFINED=true
     *     - TASK_EXISTS=false
     *   - TODO 2 OPTION_HELP_PASSED=true
     *     - MODULE_EXISTS=true
     *     - TASK_EXISTS=false
     *     - OPTION_HELP_PASSED=true
     * - 3 runModulePrompt()
     *   - MODULE_DEFINED=true
     *   - MODULE_EXISTS=true
     *   - TASK_DEFINED=false
     * - 4 printPackageHelp()
     *   - 1 wrong usage
     *     - MODULE_DEFINED=true
     *     - MODULE_EXISTS=false
     *   - TODO 2 help options passed
     *     - MODULE_EXISTS=false
     *     - OPTION_HELP_PASSED=true
     * - TODO 5 printTaskHelp()
     *   - MODULE_EXISTS=true
     *   - TASK_EXISTS=true
     *   - OPTION_HELP_PASSED=true
     * ```
     * @TODO
     * ```
     * - 11 package: help
     * - 12 package: prompt
     * - 21 module: help
     * - 22 module: prompt
     * - 31 task: help
     * - 32 task: prompt
     * - 33 task: run
     *
     * - [ ] add -h --help flag for package / module / task
     * ```
     */
    public parseProgramArguments(
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
     * Returns the commander programCommander for the package, which already
     * parsed the arguments.
     * @param print  Says if the programCommander should be printed to the cli.
     * This is mainly for helping understanding commander.
     * @returns  The programCommander which contains the cli options.
     *  * @TODO
     * ```
     *
     * - [ ] write comments
     * - [ ] create tests
     * - [ ] implement code
     * - [ ] get version from package version
     * - [ ] get description from package description
     * ```
     */
    public getPackageProgram(
        print: boolean = false,
    ): any {
        const PROGRAM = programCommander
        PROGRAM.description('Application simple description\nmutliline')
        PROGRAM.version('0.1.0')
        PROGRAM.command('<module> [task]')
        PROGRAM.on('--help', () => {
            console.log( // tslint:disable-line:no-console
                '',
            )
            console.log( // tslint:disable-line:no-console
                'Examples:',
            )
            console.log( // tslint:disable-line:no-console
                '  $ ya npm publish --src . --semver minor',
            )
            console.log( // tslint:disable-line:no-console
                '  $ yagpt npm publish --src . --semver minor ',
            )

        })
        // const ARGS_CONTAIN_HELP = this.removeArgsFromProcessArgv(
        // ['-h', '--help'],
        // )
        // if ( ARGS_CONTAIN_HELP  === true ) {
        // console.log( // tslint:disable-line:no-console
        // 'argv contained help',
        // )
        // }
        PROGRAM.parse(process.argv)
        if (print === true) {
            console.log( // tslint:disable-line:no-console
                'PROGRAM',
                PROGRAM,
            )
        }
        return PROGRAM
    }

    /**
     * public removeArgsFromProcessArgv
     * Removes a argument from the list of arguments in process.argv
     * @param
     * @returns
     * ```
     * - [ ] 1. boolean=true when arg exists and removed
     * - [ ] 2. boolean=false when arg exists not
     * ```
     * @TODO
     * ```
     *
     * - [ ] write comments
     * - [ ] create tests
     * - [ ] implement code
     * ```
     */
    public removeArgsFromProcessArgv(
        args: string[],
    ): boolean | string {
        let result
        result = false
        for (const arg of args) {
            const index = process.argv.indexOf(arg)
            if (index > -1) {
                process.argv.splice(index, 1)
                result = true
            }
        }
        return result
    }

    /**
     * @TODO
     * ```
     *
     * - [ ] comment
     * - [ ]
     * ```
     */
    public async runTask(task: string): Promise<any> {
        let result
        result = true
        if (task === 'publish') {
            // const TASK = new TNpmPublish(process.cwd())
            // result = await TASK.runTask()
            // console.log( // tslint:disable-line:no-console
            // 'result',
            // result,
            // )
        }
        return result
    }

}
export const UPackage = new UPackageUtility()
