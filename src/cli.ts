import { UCommander } from '@utils/nodejs/commander'
import { UTest } from '@utils/nodejs/test'

if (UTest.getEnv() !== 'testing') {
    UCommander.runProgram()
}
