const COLORS = require('colors/safe')
const SHELL = require('shelljs')
import { UEnvironment } from '@utils/nodejs/environment'

/**
 * TODO
 */
export interface ISuperTaskLogValueColorTheme {
    description: [string];
    value: any;
}

/**
 * TODO
 */
export interface ISuperTaskLogHeaderColorTheme {
    devider: [string];
    value: any;
}

/**
 * This class helps with all the different Logging Tasks in the project.
 */
export class LoggerUtility {

    public LOG_VALUE_COLOR_THEME = {
        description: ['rainbow'],
        value: ['white'],
    }
    public LOG_HEADER_COLOR_THEME = {
        devider: ['rainbow'],
        value: ['white', 'bold'],
    }
    public logging: boolean = true

    /**
     * Logs a given value.
     * @param DESCRIPTION  The description of the value to log.
     * @param VALUE  The actual value to log.
     * @returns
     * ```
     * boolean true: when logging active
     * boolean false: when logging not active
     * ```
     */
    public logValue(
        DESCRIPTION: string | number,
        VALUE: any,
        THEME?,
        PRINT: boolean = false,
        OFFSET: number = 0,
    ): boolean {
        if (this.logging) {
            let msg: string
            let description = DESCRIPTION.toString()
            const RUNS = OFFSET - description.length
            for (let i = 0; i < RUNS; i++) {
                description = ' ' + description
            }
            if (THEME) {
                COLORS.setTheme(THEME)
                msg = [
                    COLORS.description(description),
                    ' ',
                    COLORS.value(VALUE.toString()),
                ].join('')
            } else {
                msg = [
                    description,
                    ' ',
                    VALUE,
                ].join('')
            }
            console.log(msg) // tslint:disable-line:no-console
            if (PRINT === false) {
                this.userInputCleanup(1)
            }
        }
        return this.logging
    }

    /**
     * Logs a Header.
     * @param VALUE  The Title of the Header
     * @param DEVIDER  The form of the devider. For example = or -
     * @param OFFSET  In which row to start the printout.
     * @param DEVIDER_LENGTH  The lenght of the devider
     * @param THEME  A color theme for the printout.
     * @returns
     * ```
     * boolean true: when logging active
     * boolean false: when logging not active
     * ```
     */
    public logHeader(
        VALUE: string,
        DEVIDER: string,
        OFFSET: number = 0,
        DEVIDER_LENGTH: number = 0,
        THEME?,
        PRINT: boolean = false,
    ): boolean {
        if (this.logging) {
            let msg: string
            let offset: string = ''
            let devider: string = ''
            for (let i = 0; i < OFFSET; i++) {
                offset = offset + ' '
            }
            for (let i = 0; i < DEVIDER_LENGTH; i++) {
                devider = devider + DEVIDER
            }
            if (THEME) {
                COLORS.setTheme(THEME)
                msg = [
                    offset,
                    COLORS.devider(devider),
                    ' ',
                    COLORS.value(VALUE),
                    ' ',
                    COLORS.devider(devider),
                ].join('')
            } else {
                msg = [
                    offset + VALUE,
                ].join('')
            }
            console.log(msg) // tslint:disable-line:no-console
            this.userInputCleanup(1)
        }
        return this.logging
    }

    /**
     * Cleans up cli output.
     * @param numberOfLinesToCleanup  The number of lines to clean up.
     * @returns
     *      1. boolean=true: when cleanup was run and env=testing
     *      2. boolean=false: when env!==testing
     */
    public async userInputCleanup(
        numberOfLinesToCleanup: number,
    ): Promise <boolean> {
        let userInputCleanupRun = false
        if (UEnvironment.getEnv() === 'testing') {
            let cleanupCommand = 'tput cuu1 && echo "'
            for (let i = 0; i < 80; i++) {
                cleanupCommand = cleanupCommand + ' '
            }
            cleanupCommand = cleanupCommand + '" && tput cuu1'
            for (let i = 0; i < numberOfLinesToCleanup; i++) {
                SHELL.exec(cleanupCommand)
            }
            userInputCleanupRun = true
        }
        return userInputCleanupRun
    }

}
export const ULogger = new LoggerUtility()
