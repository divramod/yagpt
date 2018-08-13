// const shell = require('shelljs')
// import * as path from 'path'
// import { promptJobs } from '@utils/index'

/**
 * promptProjects
 * - TODO
 */
export async function promptProjects(PROJECTS) {
    const inquirer = require('inquirer')
    // await test()
    const RESULT1 = await inquirer.prompt([{
        message: 'What\'s your name?',
        name: 'name',
        type: 'input',
    }, {
        choices: ['green tea', 'poppyseed jam', 'chile', 'vanilla'],
        default: 3,
        message: 'Which is your favorite of the following ice cream flavors?',
        name: 'iceCream',
        type: 'list',
    }])

    // console.log('result', RESULT1) // tslint:disable-line:no-console
    // const MENU_CHOICE = await promptProjectsMenu(PROJECTS)
}

// https://gitlab.com///issues/

/**
 * test()
 * [ ] 
 */
export async function test() {
  console.log('test') // tslint:disable-line:no-console
}

/**
 * promptProjectsMenu
 * - TODO
 */
async function promptProjectsMenu(PROJECTS) {

    // console.log('menu', PROJECTS) // tslint:disable-line:no-console
    // const CHOICES = []
    // for (const PROJECT_ENTRY of PROJECTS) {
    // const projectEntry = PROJECT_ENTRY
    // if (PROJECT_ENTRY.path) {
    // projectEntry.value = PROJECT_ENTRY.path
    // } else {
    // projectEntry.value = PROJECT_ENTRY.name
    // }
    // CHOICES.push(projectEntry)
    // }

    // const Q = [
    // { type: 'list', name: 'menu', message: '', choices: CHOICES },
    // ]
    // const CHOICE = await inquirer.prompt(Q)
    // const PATH = CHOICE.menu
    // const CWD = await shell.pwd()
    // const SUBMENU_PATH = path.join(CWD.toString(), CHOICE.menu, 'src', 'jobs')
    // console.log('SUBMENU_PATH', SUBMENU_PATH) // tslint:disable-line:no-console
    // const result = promptJobs(SUBMENU_PATH)
    return "test"
}
