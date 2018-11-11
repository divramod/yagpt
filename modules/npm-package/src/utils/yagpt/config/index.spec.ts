import { describe, expect, it, UTest } from '@utils/yagpt/test'
import { UConfig as U_INSTANCE, UConfigUtility as U_CLASS } from './'

describe('UConfig ' + __filename, async () => {

    describe('constructor()', async () => {

        it.skip([
            'should use the configJsonPath',
        ].join(' '), async () => {
            const R = new U_CLASS()
            expect(R).to.be.an('object')
        })
    })

})
