const MOMENT = require('moment')
import { UDate } from '@utils/nodejs/date'
import { ULogger } from '@utils/nodejs/logger'
import { UTest } from '@utils/nodejs/test'

// TYPINGS
import {
    ISuperTaskConstructorParams,
    ISuperTaskLogHeaderColorTheme,
    ISuperTaskLogValueColorTheme,
} from './index.d'

export {
    ITask,
    ITaskConstructorParams,
} from './index.d'

export class TaskUtility {

    public name: string
    private runStartTime: Date
    private runEndTime: Date

    /**
     * Sets the starttime of the task and logs a header with the taskname and
     * the starttime to the screen.
     */
    public async runBefore(): Promise<void> {
        this.runStartTime = MOMENT(new Date())
        ULogger.logHeader(
            this.name,
            '=',
            6,
            20,
            ULogger.LOG_HEADER_COLOR_THEME,
        )
        ULogger.logValue(
            'start:',
            MOMENT(this.runStartTime).format('hh:mm:ss SSS'),
            ULogger.LOG_VALUE_COLOR_THEME,
        )
    }

    /**
     * Calculates the amount of time the task was running and logs starttime,
     * endtime and duration to the screen.
     */
    public async runAfter(): Promise<void> {
        this.runEndTime = MOMENT(new Date())
        ULogger.logValue(
            'start:',
            MOMENT(this.runStartTime).format('hh:mm:ss SSS'),
            ULogger.LOG_VALUE_COLOR_THEME,
        )
        ULogger.logValue(
            'end:',
            MOMENT(this.runEndTime).format('hh:mm:ss SSS'),
            ULogger.LOG_VALUE_COLOR_THEME,
        )
        ULogger.logValue(
            'duration:',
            UDate.getDateDiff(this.runStartTime, this.runEndTime),
            ULogger.LOG_VALUE_COLOR_THEME,
        )
    }

}
