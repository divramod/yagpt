// TYPINGS
import { ISuperTaskConstructorParams } from './index.d'

export class SuperTask {
    public cwd: string
    public name: string
    public logging: boolean
    public runStart: string
    public runEnd: string

    constructor( { name, cwd, logging }: ISuperTaskConstructorParams ) {
        this.cwd = cwd
        this.logging = logging
        this.name = name
    }

    public printName() {
        if (this.logging) {
            console.log(this.name) // tslint:disable-line:no-console
        }
    }

    public async getName() {
        return this.name
    }

    public async runBefore() {
        if (this.logging) {
            console.log(this.name + ' running ') // tslint:disable-line:no-console
            // TODO: print out name
        }

    }

    public async runAfter() {
        if (this.logging) {
            console.log(this.name + ' running ') // tslint:disable-line:no-console
            // TODO: print out time
        }

    }

    public getCurrentTime() {
        console.log('get current time') // tslint:disable-line:no-console
    }

    public getRunSubResultObject() {
        return {
            error: undefined,
            msg: undefined,
            success: undefined,
            value: undefined,
        }
    }

    public getRunReturnObject() {
        return {
            options: undefined,
            results: undefined,
            success: undefined,
            value: undefined,
        }
    }

}
