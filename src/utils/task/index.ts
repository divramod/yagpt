const MOMENT = require('moment')
const COLORS = require('colors/safe')

// TYPINGS
import {
    // ISuperTaskClass,
    ISuperTaskConstructorParams,
    ISuperTaskLogHeaderColorTheme,
    ISuperTaskLogValueColorTheme,
} from './index.d'

export class SuperTask {
    public cwd: string
    public name: string
    public logging: boolean
    public runStartTime: Date
    public runEndTime: Date
    public LOG_VALUE_COLOR_THEME: ISuperTaskLogValueColorTheme = {
        description: ['rainbow'],
        value: ['white'],
    }
    public LOG_HEADER_COLOR_THEME: ISuperTaskLogHeaderColorTheme = {
        devider: ['rainbow'],
        value: ['white', 'bold'],
    }

    constructor( { name, cwd, logging }: ISuperTaskConstructorParams ) {
        this.cwd = cwd
        this.logging = logging
        this.name = name
    }

    public printName() {
        if (this.logging) {
            this.logHeader(
                this.name,
                '=',
                6,
                20,
                this.LOG_HEADER_COLOR_THEME,
            )
        }
    }

    public getName() {
        return this.name
    }

    public async runBefore() {
        if (this.logging) {
            // TODO: print out name
            this.runStartTime = MOMENT(new Date())
            this.printName()
            this.logValue(
                'start:',
                MOMENT(this.runStartTime).format('hh:mm:ss SSS'),
                this.LOG_VALUE_COLOR_THEME,
            )
        }

    }

    public async runAfter() {
        if (this.logging) {
            this.runEndTime = MOMENT(new Date())
            this.logValue(
                'end:',
                MOMENT(this.runEndTime).format('hh:mm:ss SSS'),
                this.LOG_VALUE_COLOR_THEME,
            )
            this.logValue(
                'duration:',
                this.getDateDiff(this.runStartTime, this.runEndTime),
                this.LOG_VALUE_COLOR_THEME,
            )
        }
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
    }

    public getDateDiff(DATE1, DATE2) {
        return DATE2 - DATE1
    }

    public async wait(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }

    private logHeader(
        VALUE: string,
        DEVIDER: string,
        OFFSET: number = 0,
        DEVIDER_LENGTH: number = 0,
        THEME?,
    ) {
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
    }

}
