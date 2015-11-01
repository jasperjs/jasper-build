export interface IFileUtils {
    readJSON<T>(filename: string): T;
    writeJSON(filename: string, data: any): any;
    readFile(filename: string): string;
    writeFile(filename: string, data: string): any;
    fileExists(filename: string): boolean;
    expand(pattern: string): string[];
    concat(filenames: string[]): string;
}
export declare class DefaultFileUtils implements IFileUtils {
    private cwd;
    constructor(cwd?: string);
    readJSON<T>(filename: string): T;
    writeJSON(filename: string, data: any): void;
    readFile(filename: string): string;
    writeFile(filename: string, data: string): void;
    fileExists(filename: string): boolean;
    expand(pattern: string): string[];
    concat(filenames: string[]): string;
    private dirExists(folderpath);
    private mkDirRecursive(dirPath, mode?);
}
