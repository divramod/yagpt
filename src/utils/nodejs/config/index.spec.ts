import { describe, expect, it, UTest } from '@utils/nodejs/test'
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

    describe('getEnv()', async () => {

        it([
            '1. env=testing',
        ].join(' '), async () => {
            const R = await U_INSTANCE.getEnv()
            expect(R).to.equal('testing')
        })

    })

})
