import { describe, expect, it, UTest } from '@utils/nodejs/test'
import { UConfig as U_INSTANCE } from './'

describe('UConfig ' + __filename, async () => {

    describe('getEnv()', async () => {

        it([
            '1. env=testing',
        ].join(' '), async () => {
            const R = await U_INSTANCE.getEnv()
            expect(R).to.equal('testing')
        })

    })

    describe.only('constants', async () => {

        it([
            'test constants',
        ].join(' '), async () => {
            expect(false).to.equal(true)
        })

    })

})
