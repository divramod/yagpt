const MOMENT = require('moment')
import { UDate } from '@utils/nodejs/date'
import { ULogger } from '@utils/nodejs/logger'
import { UTest } from '@utils/yagpt/test'

/**
 * This class is intended to help devops with solving the problems they face on
 * a daily basis when developing software. Usally their work needs them to
 * follow workflows to solve tasks. Most of the tasks contain a set of steps
 * which lead to successful solving of the task. For example the gitflow
 * workflow task of releasing a feature in a new version of a software contains
 * the steps of merging the develop branch into the feature, than merging the
 * feature into develop, than creating a release from develop and pointing
 * master to the release and so on. These are a lot of steps, where something
 * can go wrong. If something goes wrong in such a task, it usually means that
 * there is time, which has to be invested solving the things which have gone
 * wrong. The task class will help avoiding having to invest time to solve
 * problems created in such automatble tasks. The class will ensure, that all
 * tasks created, will follow rules and restrictions to avoid making mistakes.
 * For that for example, it forces the developer to implement a function which
 * checks, if all prerequisites for fullfilling a task are met, before running
 * the task itself. Staying with the gitflow-example, it is possible, that the
 * current feature branch isn't clean or that develop could not be automatically
 * be merged into the feature. The function which checks the prerequisites will
 * tell the developer, which prerequisites are not fullfilled and creates
 * attention for the possible errors/problems which could arise in the process
 * of working through the task. Another thing the class will help with is to log
 * the results of the substeps of a task. This will help with debugging possible
 * errors.
 *
 * Tasks, implementing this class need to be named in the pattern of
 * NameOfTaskTask. The export name must follow the pattern TNameOfTask.
 *
 * @param name  The name of the task
 * @param runStartTime  The start time of the task
 * @param runEndTime  The time, when the task finished
 */
class TaskUtility {

    /**
     * The name of the Task.
     */
    public name: string

    /**
     * The start time of the Task.
     */
    private runStartTime: Date

    /**
     * The end time of the Task.
     */
    private runEndTime: Date

    /**
     * The child task, which implements the task Utility. This one is here,
     * because i want to access methods of the child class from the parent.
     */
    private child

    /**
     * This array saves, the metadata of a step which ran. It is there for
     * beeing able to inspect and log the results of running the tasksteps.
     */
    private stepsLog: any[] = []

    /**
     * This array saves, the metadata of a prerequisit check which ran.
     * It is there for beeing able to inspect and log the results of running
     * the prerequisit steps.
     */
    private prerequisitesLog: any[] = []

    /**
     * Runs a step or a prerequisit check, passed in by the childs functions
     * runSteps and checkPrerequisites.
     * @param name  The name of the step.
     * @param comment  A comment for the step.
     * @param hide  If you want to surpress the logging out of the step data
     * in the function [[printStepLog]]
     * @param run  If the step should be ran.
     * @param handlerFunction  The function, which should be run as a step.
     * @returns  The result of the step.
     */
    public async runStep(
        { name = '', comment = '', run = true, hide = false }:
        { name?: string, comment?: string, run?: boolean, hide?: boolean },
        handlerFunction?: any,
    ): Promise<boolean | string> {
        const START = UDate.getDate()
        let result
        try {
            result = await handlerFunction()
        } catch (e) {
            result = e.message
        }
        const END = UDate.getDate()
        const DURATION = UDate.getDateDiff(START, END)
        const STEP = {
            comment,
            duration: DURATION,
            end: END,
            hide,
            name,
            result,
            start: START,
        }
        this.stepsLog.push(STEP)
        return STEP.result
    }

    /**
     * Set The child task, which implements the task Utility. This one is here,
     * because i want to access methods of the child class from the parent.
     * @param  The child, which extends the TaskUtility class.
     */
    public setChild(
        child: any,
    ): void {
        this.child = child
    }

    /**
     * Prints the results of the different steps, which were run by the task.
     */
    public printStepLog(): boolean {
        let stepNumber = 0
        for (const step of this.stepsLog) {
            stepNumber++
            if (step.hide === false) {
                ULogger.logValue(
                    stepNumber,
                    step.name + ' (' + step.duration + ')',
                    ULogger.LOG_VALUE_COLOR_THEME,
                    false,
                    2,
                )
            }
        }
        return true
    }

    /**
     * Checks if the task is runnable. If all checks pass, it will start to run
     * the steps of the task.
     * @param printStepLog  If you want to print the logs for the steps.
     * @returns
     * The result of the task, wich contains the results of the substeps and
     * the results of the prerequisites checks.
     * RESULT.value
     * 1. true if successfully ran
     * 2. false if something happened
     */
    public async runTask(
        printStepLog: boolean = false,
    ): Promise<any> {
        await this.runBefore()
        const IS_RUNNABLE = await this.checkIsRunnable()
        const RESULT = {
            value: undefined,
        }
        if (IS_RUNNABLE.value === true) {
            await this.child.runSteps()
            RESULT.value = true
        } else {
            RESULT.value = false
        }
        await this.runAfter()
        if (printStepLog === true) {
            this.printStepLog()
        }
        return RESULT
    }

    /**
     * A wrapper around the checkPrerequisites function of the inheriting
     * classes. The wrapper is for convinience, so that the checkPrerequisites
     * functions of the inheriting classes can be kept as clean as possible.
     * The function checks, if all prerequisites are met and adds a value prop
     * to the result object, which indicates if a task can be run.
     * @returns
     * An object witch the results of the checkPrerequisites call plus a value
     * property which says, if all checks returned true, which indicates, if a
     * task can be run without doubt.
     */
    public async checkIsRunnable(): Promise<any> {
        const CHECK_PREREQUISITES_RESULT = await this.child.checkPrerequisites()
        CHECK_PREREQUISITES_RESULT.value = true
        for (const prop in CHECK_PREREQUISITES_RESULT) {
            if (CHECK_PREREQUISITES_RESULT[prop] !== true) {
                CHECK_PREREQUISITES_RESULT.value = false
            }
        }
        return CHECK_PREREQUISITES_RESULT
    }

    /**
     * Sets the starttime of the task and logs a header with the taskname and
     * the starttime to the screen.
     */
    public async runBefore(): Promise<boolean> {
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
        return true
    }

    /**
     * Calculates the amount of time the task was running and logs starttime,
     * endtime and duration to the screen.
     */
    public async runAfter(): Promise<boolean> {
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
        return true
    }

}
export const UTask = TaskUtility
export interface ITask {
    runSteps(): Promise<any>;
    checkPrerequisites(): Promise<any>;
}
