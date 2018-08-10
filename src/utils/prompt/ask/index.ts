const inquirer = require('inquirer')

/**
 * ask()
 * [ ]
 */
export async function ask(QUESTIONS) {
    // const prompt = inquirer.createPromptModule({ output: process.stderr })
    const prompt = inquirer.createPromptModule()
    return prompt(QUESTIONS)
}
