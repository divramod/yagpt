// EXPORT
export interface ITest {
    name: string;
}

declare module '*.json' {
    const value: any
    export default value
}
