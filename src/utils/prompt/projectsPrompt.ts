const shell = require('shelljs')
import * as path from 'path'
const inquirer = require('inquirer')
import { runJobsPrompt } from '@utils/prompt/jobsPrompt'

/**
 * runProjectsPrompt
 * - TODO
 */
export async function runProjectsPrompt(PROJECTS) {
    const MENU_CHOICE = await menu(PROJECTS)
}

/**
 * menu
 * - TODO
 */
async function menu(PROJECTS) {
    console.log('menu', PROJECTS) // tslint:disable-line:no-console
    const CHOICES = []
    for (const PROJECT_ENTRY of PROJECTS) {
        const projectEntry = PROJECT_ENTRY
        if (PROJECT_ENTRY.path) {
            projectEntry.value = PROJECT_ENTRY.path
        } else {
            projectEntry.value = PROJECT_ENTRY.name
        }
        CHOICES.push(projectEntry)
    }

    const Q = [
        { type: 'list', name: 'menu', message: '', choices: CHOICES },
    ]
    const CHOICE = await inquirer.prompt(Q)
    const PATH = CHOICE.menu
    const CWD = await shell.pwd()
    const SUBMENU_PATH = path.join(CWD.toString(), CHOICE.menu, 'src', 'jobs')
    console.log('SUBMENU_PATH', SUBMENU_PATH) // tslint:disable-line:no-console
    const result = runJobsPrompt(SUBMENU_PATH)
}
