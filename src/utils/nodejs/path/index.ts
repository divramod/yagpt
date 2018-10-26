// https://gitlab.com/divramod/yagpt/issues/4

// REQUIRE
const FS = require('fs')
const PATH = require('path')
const RIMRAF = require('rimraf')
const SHELL = require('shelljs')

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

    // TODO
    // - docs
    // - tests
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
            RIMRAF.sync(DIRECTORY_PATH) // REMOVE DIRECTORY
            SHELL.mkdir('-p', DIRECTORY_PATH) // CREATE DIRECTORY
            result = [
                'Directory',
                DIRECTORY_PATH,
                'created!',
            ].join(' ')
        }
        return result
    }

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
                if (!overwriteIfExistant) {
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
                result = [
                    filePath,
                    'overwritten!',
                ].join(' ')
            }
            if (writeFile && !FILE_EXSITANT) {
                result = [
                    filePath,
                    'created!',
                ].join(' ')
            }
        } else {
            result = [
                'Directory',
                FILE_DIRECTORY_PATH,
                'not existant!',
            ].join(' ')
        }
        return result
    }

}
export const UPath = UPathUtility.getInstance()
