import { SuperTask } from '@utils/task'

export class TestSuperTask extends SuperTask {

    constructor(inputName: string, inputCwd: string) {
        super(inputName, inputCwd)
    }

    public test() {
        return 'Hello, ' + this.name
    }

}
