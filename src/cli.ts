import { UEnvironment } from '@utils/nodejs/environment'
import { UPackage } from '@utils/yagpt/package'

if (UEnvironment.getEnv() !== 'testing') {
    UPackage.run()
}
