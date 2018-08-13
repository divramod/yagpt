const inquirer = require('inquirer')

async function bla() {

    const result = await inquirer.prompt([{
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

    console.log('result', result) // tslint:disable-line:no-console

}

bla()
