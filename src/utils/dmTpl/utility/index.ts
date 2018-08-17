// https://gitlab.com/divramod/dm-tpl/issues/7

// IMPORT

// TYPINGS

// CLASS
export class Utility {

    public static getInstance(): Utility {
        return Utility.INSTANCE
    }

    private static INSTANCE: Utility = new Utility()

    constructor() {
        if (Utility.INSTANCE) {
            throw new Error('Error: Instantiation failed: Use Utility.getInstance() instead of new.')
        }
        Utility.INSTANCE = this
    }

    public async test() {
        return true
    }

    public async test1() {
        return true
    }

}
