// https://gitlab.com/divramod/yagpt/issues/4

// IMPORT
import { IResult, ISubresults } from './index.d'

// EXPORT
export * from './index.d'

// TYPINGS

// CLASS
export class UCommonUtility {

    public static getInstance(): UCommonUtility {
        return UCommonUtility.INSTANCE
    }

    private static INSTANCE: UCommonUtility = new UCommonUtility()
    public name: string = 'UCommonUtility'

    constructor() {
        if (UCommonUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        UCommonUtility.INSTANCE = this
    }

    public getResultObjectOne(): IResult {
        return {
            error: undefined,
            message: undefined,
            value: undefined,
        }
    }

    public getResultObjectMultiple(): IResult {
        return {
            error: undefined,
            message: undefined,
            subresults: {},
            value: undefined,
        }
    }

    public getResultsObject(
        ATOMIC_RESULT_STRINGS,
    ): ISubresults | any {
        const resultsObject = {}
        for (const resultString of ATOMIC_RESULT_STRINGS) {
            const RESULT_OBJECT: IResult = this.getResultObjectOne()
            resultsObject[resultString] = RESULT_OBJECT
        }
        return resultsObject
    }

}
export const UCommon = UCommonUtility.getInstance()
