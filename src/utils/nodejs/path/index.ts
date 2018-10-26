const FS = require('fs')
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

export class UPathUtility {

    /**
     * Creates a Directory at a given path.
     * @param directoryPath  The path of the directory to create.
     * @param deleteDirectoryIfExistant  If to delete the directory if existant
     * @returns
     *      1. boolean=true when not existant
     *      2. boolean=true when existant and `deleteDirectoryIfExistant`=true
     *      3. string=ERROR: when existant and `deleteDirectoryIfExistant`=false
     */
    public async createDirectory(
        directoryPath: string,
        deleteDirectoryIfExistant: boolean = false,
    ): Promise<string | boolean> {
        let result
        const DIRECTORY_PATH = PATH.resolve(directoryPath)
        const DIRECTORY_EXISTANT = SHELL.test('-d', PATH.resolve(directoryPath))
        if (DIRECTORY_EXISTANT) {
            if (deleteDirectoryIfExistant) {
                RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
                SHELL.mkdir('-p', DIRECTORY_PATH) // CREATE DIRECTORY
                result = true
            } else {
                result = [
                    'Directory',
                    DIRECTORY_PATH,
                    'existant and not created!',
                ].join(' ')
            }
        } else {
            SHELL.mkdir('-p', DIRECTORY_PATH) // CREATE DIRECTORY
            result = true
        }
        return result
    }

    /**
     * Creates a file with the given content.
     * @param filePath  The path of the file to create.
     * @param fileContent  The content of the file to create.
     * @param overwriteIfExistant  Overwrite the file when existant.
     * @returns
     *      1. boolean=true When file not existant.
     *      2. boolean=ture When file existant and `overwriteIfExistant`=true
     *      3. string=ERROR: When file existant and `overwriteIfExistant`=false
     *      4. string=ERROR: When directory not existant
     */
    public async createFile(
        filePath: string,
        fileContent: string = '',
        overwriteIfExistant = false,
    ): Promise<string | boolean> {
        let result
        const FILE_DIRECTORY_PATH = PATH.dirname(filePath)
        const FILE_DIRECTORY_PATH_EXISTANT =
            SHELL.test('-d', FILE_DIRECTORY_PATH)
        if (FILE_DIRECTORY_PATH_EXISTANT) {
            const FILE_EXSITANT =
                SHELL.test('-f', filePath)
            let writeFile = true
            if (FILE_EXSITANT) {
                if (overwriteIfExistant === false) {
                    writeFile = false
                    result = [
                        filePath,
                        'existant!',
                    ].join(' ')
                }
            }
            if (writeFile) {
                FS.writeFileSync(filePath, fileContent)
                result = true
            }
            if (writeFile && FILE_EXSITANT) {
                // TODO
                result = true
            }
            if (writeFile && !FILE_EXSITANT) {
                // TODO
                result = true
            }
        } else {
            result = [
                'ERROR:',
                'Directory',
                FILE_DIRECTORY_PATH,
                'not existant!',
            ].join(' ')
        }
        return result
    }

}

export const UPath = new UPathUtility()
