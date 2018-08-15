import { TestSuperTask } from '@utils/test'

export class Task extends TestSuperTask {

    constructor(inputCwd: string) {
        super('Test 1', inputCwd)
    }

}
