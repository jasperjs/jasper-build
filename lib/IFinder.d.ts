import f = require('./IFileUtils');
export interface IFinder {
    /**
     * Find all files in folder
     * @param folderpath    folder to search
     */
    find(folderpath: string): string[];
    /**
     * Find all files in folder includes all subfolders
     * @param folderpath    folder to search
     */
    findRecursive(folderpath: string): string[];
}
export declare class TypeScriptFinder implements IFinder {
    private fileUtils;
    constructor(fileUtils: f.IFileUtils);
    find(folderpath: string): string[];
    findRecursive(folderpath: string): string[];
    private findInternal(folderpath, mask);
}
export declare class JavaScriptFinder implements IFinder {
    private fileUtils;
    constructor(fileUtils: f.IFileUtils);
    find(folderpath: string): string[];
    findRecursive(folderpath: string): string[];
    private findInternal(folderpath, mask);
}
export declare class CssFinder implements IFinder {
    private fileUtils;
    constructor(fileUtils: f.IFileUtils);
    find(folderpath: string): string[];
    findRecursive(folderpath: string): string[];
    private findInternal(folderpath, mask);
}
