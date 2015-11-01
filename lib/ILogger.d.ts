export interface ILogger {
    info(message: string): any;
    warn(message: string): any;
    error(message: string): any;
}
export declare class DefaultLogger implements ILogger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
