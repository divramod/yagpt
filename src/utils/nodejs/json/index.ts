const PATH = require('path')
const SHELL = require('shelljs')
export class UJsonUtility {

    /**
     * Gets a key value from a json file.
     * @param filePath  The path of the file to get the key value from.
     * @param keyName  The key to get the value from.
     * @returns
     *      1. string=KEY_VALUE
     *      2. string=ERROR: `keyName` not existant in `filePath`
     *      3. string=ERROR: `filePath`not existant
     */
    public getKeyValueFromFile(
        filePath: string,
        keyName: string,
    ): string | boolean | any {
        let result
        const FILE_EXSITANT = SHELL.test('-f', PATH.resolve(filePath))
        if (FILE_EXSITANT) {
            delete require.cache[filePath]
            const FILE = require(filePath)
            if (FILE[keyName]) {
                result = true
                result = FILE[keyName]
            } else {
                result = [
                    'ERROR:',
                    keyName,
                    'not existant in',
                    filePath + '!',
                ].join(' ')
            }
        } else {
            result = [
                'ERROR:',
                filePath,
                'not existant!',
            ].join(' ')
        }
        return result
    }

}
export const UJson = new UJsonUtility()
