const MOMENT = require('moment')
const COLORS = require('colors/safe')
import { UDate } from '@utils/nodejs/date'
import { UTest } from '@utils/nodejs/test'

// TYPINGS
import {
    // ISuperTaskClass,
    ISuperTaskConstructorParams,
    ISuperTaskLogHeaderColorTheme,
    ISuperTaskLogValueColorTheme,
} from './index.d'

export { ITaskClass, ITaskConstructorParams, ITaskRunResult, ITaskRunSubResult, ITaskRunSubResults } from './index.d'

export class SuperTask {
    public UTEST = UTest.getInstance()
    public UDATE = UDate.getInstance()

    private cwd: string
    private name: string
    private logging: boolean
    private runStartTime: Date
    private runEndTime: Date
    private LOG_VALUE_COLOR_THEME: ISuperTaskLogValueColorTheme = {
        description: ['rainbow'],
        value: ['white'],
    }
    private LOG_HEADER_COLOR_THEME: ISuperTaskLogHeaderColorTheme = {
        devider: ['rainbow'],
        value: ['white', 'bold'],
    }

    constructor( { name, cwd, logging }: ISuperTaskConstructorParams ) {
        this.cwd = cwd
        this.logging = logging
        this.name = name
    }

    public printName() {
        let printed = false
        if (this.logging) {
            this.logHeader(
                this.name,
                '=',
                6,
                20,
                this.LOG_HEADER_COLOR_THEME,
            )
            printed = true
        }
        return printed
    }

    public getTaskPath() {
        let taskPath = ''
        const CURRENT_PATH = this.cwd
        taskPath = '@' + CURRENT_PATH.substring(CURRENT_PATH.lastIndexOf('src') + 4, CURRENT_PATH.length)
        return taskPath
    }

    public getName() {
        return this.name
    }

    public async runBefore() {
        let runBefore = false
        if (this.logging) {
            this.runStartTime = MOMENT(new Date())
            this.printName()
            this.logValue(
                'start:',
                MOMENT(this.runStartTime).format('hh:mm:ss SSS'),
                this.LOG_VALUE_COLOR_THEME,
            )
            runBefore = true
        }
        return runBefore
    }

    public async runAfter() {
        let runAfter = false
        if (this.logging) {
            this.runEndTime = MOMENT(new Date())
            this.logValue(
                'end:',
                MOMENT(this.runEndTime).format('hh:mm:ss SSS'),
                this.LOG_VALUE_COLOR_THEME,
            )
            this.logValue(
                'duration:',
                this.UDATE.getDateDiff(this.runStartTime, this.runEndTime),
                this.LOG_VALUE_COLOR_THEME,
            )
            runAfter = true
        }
        return runAfter
    }

    public getRunSubResultObject() {
        return {
            error: undefined,
            msg: undefined,
            success: undefined,
            value: undefined,
        }
    }

    public getRunReturnObject() {
        return {
            options: undefined,
            results: undefined,
            success: undefined,
            value: undefined,
        }
    }

    public logValue(DESCRIPTION: string, VALUE: any, THEME?) {
        if (this.logging) {
            let msg: string
            let description = DESCRIPTION.toString()
            const RUNS = 15 - DESCRIPTION.length
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
            this.UTEST.userInputCleanup(1)
        }
        return this.logging
    }

    public logHeader(
        VALUE: string,
        DEVIDER: string,
        OFFSET: number = 0,
        DEVIDER_LENGTH: number = 0,
        THEME?,
    ) {
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
            this.UTEST.userInputCleanup(1)
        }
        return this.logging
    }

}
