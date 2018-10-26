export class UDateUtility {

    /**
     * Receives two Dates and gives back the date difference.
     * @param dateBegin  The beginning date.
     * @param dateEnd  The end date.
     */
    // TODO
    // - automatically detect which is the beginning and which is the end date.
    public getDateDiff(
        dateBegin,
        dateEnd,
    ): number {
        return dateEnd - dateBegin
    }

}
export const UDate  = new UDateUtility()
