// https://gitlab.com/divramod/dm-tpl/issues/4
const gitP = require('simple-git/promise')
const inquirer = require('inquirer')
const shell = require('shelljs')
const path = require('path')

// import { promptAsk } from './../../../../../../utils/prompt/ask' // running
// import { promptAsk } from '@utils/index' // not running
import { promptAsk } from '@utils/prompt/index' // running

/**
 * run()
 * DONE: parse current path
 * DONE: git: prove if is git repo
 * TODO: prompt: ask if the repo is the right one
 * TODO: git: checkout develop
 * TODO: git: checkout release from develop (use version from package.json)
 * TODO: git: checkout develop and merge release back to it, when changes occur
 * TODO: git: checkout master and merge release back to it
 * TODO: git: tag master with release number
 * TODO: git: push master / release / develop / tags
 * TODO: git: checkout develop
 */
export async function run() {

    // DONE: parse current path
    const PWD_RESULT = shell.pwd()
    const CWD = PWD_RESULT.toString()

    // git: prove if is git repo
    const git = gitP(CWD)
    const R_CHECK_IS_REPO = await git.checkIsRepo()

    // TODO: prompt: ask if the repo is the right one
    const CHOICES = [ 'yes', 'no' ]
    const MESSAGE = 'You are in path ' + CWD + '! Is this the right path?'
    const QUESTIONS = [
        {
            choices: CHOICES,
            message: MESSAGE,
            name: 'menu',
            type: 'list',
        },
    ]
    const R_PROMPT_ASK_RIGHT_REPOSITORY = await promptAsk(QUESTIONS)
    if (R_PROMPT_ASK_RIGHT_REPOSITORY === 'yes') {
    
    }
}
