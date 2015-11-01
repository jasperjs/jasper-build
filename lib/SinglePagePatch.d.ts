import file = require('./IFileUtils');
export declare class SinglePagePatch {
    private fileUtils;
    constructor(fileUtils: file.IFileUtils);
    applyPatch(singlePagePath: string, baseHref: string, scripts: string[], styles: string[]): string;
}
