import { UCommander } from '@utils/nodejs/commander'
import { UEnvironment } from '@utils/nodejs/environment'

if (UEnvironment.getEnv() !== 'testing') {
    UCommander.run()
}
