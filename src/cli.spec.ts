import { UCommander } from '@utils/nodejs/commander'
import { describe, expect, it } from '@utils/nodejs/test'

describe.only('cli ' + __filename, async () => {

    it([
        'test',
    ].join(' '), async () => {
        const program = UCommander.program
        program.npm = 'publish'
        UCommander.runProgram()
    })

})
