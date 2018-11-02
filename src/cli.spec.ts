import { UCommander } from '@utils/nodejs/commander'
import { describe, expect, it } from '@utils/nodejs/test'

describe('cli ' + __filename, async () => {

    it([
        'test',
    ].join(' '), async () => {
        const program = await UCommander.getProgram()
        // program.npm = 'publish'
        UCommander.run()
    })

})
