import { UPackage } from '@utils/yagpt/package'
import { describe, expect, it } from '@utils/yagpt/test'

describe('cli ' + __filename, async () => {

    it([
        'test',
    ].join(' '), async () => {
        const program = await UPackage.getPackageProgram()
        // program.npm = 'publish'
        UPackage.run()
    })

})
