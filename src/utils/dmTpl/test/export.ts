process.env.DMTPL_ENV = 'testing'
import * as MOCHA from 'mocha'
export { expect } from 'chai'
export const describe = MOCHA.describe
export const it = MOCHA.it
