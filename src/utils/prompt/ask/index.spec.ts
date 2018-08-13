// https://gitlab.com/divramod/dm-tpl/issues/4
// delete cli output: https://www.tldp.org/HOWTO/Bash-Prompt-HOWTO/x405.html
import { expect } from 'chai'
import 'mocha'
const shell = require('shelljs')
import { promptAsk } from './'

describe('@utils/prompt/ask', () => {
    let stdin
    beforeEach( async () => {
        stdin = require('mock-stdin').stdin()
    })

    it('should simulate a iquirer cli user input', async () => {
        const CHOICES = [ 'test-1', 'test-2' ]
        const QUESTIONS = [ { type: 'list', name: 'menu', message: '', choices: CHOICES } ]
        process.nextTick(function mockResponse() {
            stdin.send('j')
            stdin.send('\r')
        })
        const result = await promptAsk(QUESTIONS)
        shell.exec('tput cuu1')

        expect(result.menu).to.equal('test-2')
        expect(2).to.equal(2)
    })

})
