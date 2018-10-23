// result()
export interface IResult {
    error: undefined | any
    message: undefined | string
    subresults?: undefined | ISubresults
    value: undefined | any
}
export interface ISubresults {
    [key: string]: IResultOne;
}
export interface IResultOne {
    error: undefined | any;
    message: undefined | any;
    value: undefined | any;
}
