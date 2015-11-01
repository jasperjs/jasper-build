import files = require('../IFileUtils');
export interface ICssMinifier {
    minifyCss(sourceFiles: string[], outputFile: string): any;
}
export declare class CleanCssMinifier implements ICssMinifier {
    private fileUtils;
    constructor(fileUtils: files.IFileUtils);
    minifyCss(sourceFiles: string[], outputFile: string): void;
}
