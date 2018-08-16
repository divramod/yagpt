export async function main() {
    const G = './tasks/npm/publish'
    const TASK_IMPORT = await import(G)
    const TASK_CLASS = TASK_IMPORT.Task
    const TASK = new TASK_CLASS(__dirname)
    const R_TASK = TASK.run()
}

// RUN IF NOT TESTING
const PROCESS_ENV = process.env.DM_TPL_ENV
if (PROCESS_ENV !== 'testing') {
    main()
}
