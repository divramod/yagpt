const program = require('commander')
import { Npm } from '@tasks/npm'

/**
 *
 */
export class UCommanderUtility {
    public program: any

    constructor() {
        this.program = program
        this.program.version('0.1.0')
            .option('-n, --npm [task]', 'npm')
            .option('-g, --git [task]', 'git')
            .parse(process.argv)

    }

    public runProgram(): boolean {
        if (this.program.npm) {
            Npm.run(this.program.npm)
        }
        return true
    }

    public printCommander(): boolean {
        console.log( // tslint:disable-line:no-console
            'this.program',
            this.program,
        )
        return this.program
    }

}
export const UCommander = new UCommanderUtility()
