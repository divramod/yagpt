const inquirer = require('inquirer')
const SHELL = require('shelljs')

export async function promptAskYesNo(MESSAGE) {
    const CHOICES = [ 'yes', 'no' ]
    const QUESTIONS = [ { type: 'list', name: 'menu', message: MESSAGE, choices: CHOICES } ]
    const CLEANUP_COMMAND = testHelper(QUESTIONS)
    const RESULT = await inquirer.prompt(QUESTIONS)
    cleanup(CLEANUP_COMMAND)
    return RESULT.menu
}

export async function promptAsk(QUESTIONS) {
    const CLEANUP_COMMAND = testHelper(QUESTIONS)
    const RESULT = await inquirer.prompt(QUESTIONS)
    cleanup(CLEANUP_COMMAND)
    return RESULT
}

function testHelper(QUESTIONS) {
    const emptyChars = [ ]
    for (let q = 0; q < QUESTIONS.length; q++) {
        const MESSAGE = QUESTIONS[q].message
        for (let i = 0; i < (MESSAGE.length + 20); i++) {
            emptyChars[q] = emptyChars[q] + ' '
        }
        if (process.env.DM_TPL_ENV && process.env.DM_TPL_ENV === 'testing') {
            if (process.env.DM_TPL_COMMANDS && process.env.DM_TPL_COMMANDS.length > 0) {
                const DM_TPL_COMMANDS_ARR = process.env.DM_TPL_COMMANDS.split(' ')
                const DM_TPL_COMMAND_ARR = DM_TPL_COMMANDS_ARR[0].split(',')
                const STDIN = require('mock-stdin').stdin()
                for (let command of DM_TPL_COMMAND_ARR) {
                    process.nextTick(function mockResponse() {
                        if (command === 'ENTER') {
                            command = '\r'
                        }
                        STDIN.send(command)
                    })
                }
                const NEW_PROCESS_ENV = process.env.DM_TPL_COMMANDS.substring(
                    DM_TPL_COMMANDS_ARR[0].length + 1,
                    process.env.DM_TPL_COMMANDS.length,
                )
                process.env.DM_TPL_COMMANDS = NEW_PROCESS_ENV
            }
        }
        emptyChars[q] = 'tput cuu1 && echo "' + emptyChars[q] + '" && tput cuu1'
    }
    return  emptyChars
}

function cleanup(COMMANDS) {
    for (const command of COMMANDS) {
        if (process.env.DM_TPL_ENV && process.env.DM_TPL_ENV === 'testing') {
            SHELL.exec(command)
        }
    }
}
