// https://gitlab.com/divramod/dm-tpl/issues/7

// IMPORT

// TYPINGS

// CLASS
export class UDate {

    public static getInstance(): UDate {
        return UDate.INSTANCE
    }

    private static INSTANCE: UDate = new UDate()

    constructor() {
        if (UDate.INSTANCE) {
            throw new Error('Error: Instantiation failed: Use UDate.getInstance() instead of new.')
        }
        UDate.INSTANCE = this
    }

    public async test() {
        return true
    }

}
