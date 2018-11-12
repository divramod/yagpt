import { describe, expect, it, UTest } from '@utils/yagpt/test'
import { UDate as U_INSTANCE, UDateUtility as U_CLASS } from './'

describe('yaDate: ' + __filename, async () => {

    it('getDateDiff()', async () => {
        const DATE1 = +new Date()
        const DATE2 = +new Date()
        const DIFF = (DATE2 - DATE1)
        const R = U_INSTANCE.getDateDiff(DATE1, DATE2)
        expect(R).to.equal(DIFF)
    })

})
