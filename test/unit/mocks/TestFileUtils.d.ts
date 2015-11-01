import f = require('../../../lib/IFileUtils');
export declare class TestFileUtils extends f.DefaultFileUtils {
    private files;
    writeFile(filename: string, data: string): void;
    isWritten(filename: string): boolean;
    readFile(filename: string): string;
    checkFileContains(filename: string, content: string): boolean;
}
