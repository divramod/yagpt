// https://gitlab.com/divramod/dm-tpl/issues/4

// IMPORT
import { UCommon } from '@utils/nodejs/common'

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// CLASS
export class UPathUtility {

    public static getInstance(): UPathUtility {
        return UPathUtility.INSTANCE
    }

    private static INSTANCE: UPathUtility = new UPathUtility()
    public name: string = 'UPathUtility'

    constructor() {
        if (UPathUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        UPathUtility.INSTANCE = this
    }

}
export const UPath = UPathUtility.getInstance()
