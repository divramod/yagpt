// https://gitlab.com/divramod/dm-tpl/issues/5
import { expect } from 'chai'
import 'mocha'

describe.skip('@src/index.ts: path existant', () => {

    it('if: path is prompt (has jobs directory) => run prompt', async () => {
        // fail
        expect(1).to.equal(2)
    })

    it('else if: path is single job => run job', async () => {
        // fail
        expect(1).to.equal(2)
    })

    it('else: message => no job existant', async () => {
        // fail
        expect(1).to.equal(2)
    })
})

describe.skip('@src/index.ts: path not existant', () => {

    it('if project.json existant', async () => {
        // fail
        expect(1).to.equal(2)
    })

    it('if dir has src/jobs', async () => {
        // fail
        expect(1).to.equal(2)
    })

    it('if directory has no project.json and no src/jobs dir', async () => {
        // fail
        expect(1).to.equal(2)
    })

    it('if directory has no project.json and no src/jobs dir (is git)', async () => {
        // fail
        expect(1).to.equal(2)
    })

    it('if directory has no project.json and no src/jobs dir (is npm)', async () => {
        // fail
        expect(1).to.equal(2)
    })

})
