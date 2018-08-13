// https://gitlab.com/divramod/dm-tpl/issues/4
// delete cli output: https://www.tldp.org/HOWTO/Bash-Prompt-HOWTO/x405.html
import { expect } from 'chai'
import 'mocha'
const shell = require('shelljs')
import { promptAsk, promptAskYesNo } from './'

describe('@utils/prompt/ask', () => {

    describe('@utils/prompt/ask DEFAULT', () => {
        let stdin
        beforeEach( async () => {
            stdin = require('mock-stdin').stdin()
        })

        it('should simulate a iquirer cli user input', async () => {
            const CHOICES = [ 'test-1', 'test-2' ]
            const QUESTIONS = [ { type: 'list', name: 'menu', message: '', choices: CHOICES } ]

            process.env.DM_TPL_COMMANDS = 'j,ENTER'
            const result = await promptAsk(QUESTIONS)

            expect(result.menu).to.equal('test-2')
            expect(2).to.equal(2)
        })

    })

    describe('@utils/prompt/ask YES/NO', () => {
        let stdin
        beforeEach( async () => {
            stdin = require('mock-stdin').stdin()
        })

        it('should give back yes', async () => {
            process.env.DM_TPL_COMMANDS = 'ENTER'
            const RESULT = await promptAskYesNo('Do you want to do it?')

            expect(RESULT).to.equal('yes')
        })

        it('should give back no', async () => {
            process.env.DM_TPL_COMMANDS = 'j,ENTER'
            const RESULT = await promptAskYesNo('Do you want to do it?')

            expect(RESULT).to.equal('no')
        })
    })

})
