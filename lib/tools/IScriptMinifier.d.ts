import files = require('../IFileUtils');
export interface IScriptMinifier {
    /**
     * Minify @sourceFiles to @outputFile
     */
    minify(source: string, outputFile: string): any;
}
export declare class UglifyJsMinifier implements IScriptMinifier {
    private fileUtils;
    constructor(fileUtils: files.IFileUtils);
    minify(source: string, outputFile: string): void;
}
