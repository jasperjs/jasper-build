import structure = require('./project/Structure');
export declare function camelCaseTagName(tagName: string): string;
/**
 * ComponentName --> componentName
 */
export declare function camelCase(name: string): string;
/**
 *  C:\folder\file.exe --> folder
 */
export declare function getParentFolderName(filepath: string): string;
/**
 *  C:\folder\file.exe --> C:\folder\
 */
export declare function getPath(filepath: string): string;
export declare function getFileExtension(filepath: string): string;
export declare function convertPathClient(filepath: string): string;
export declare function getDirPath(filepath: string): string;
export declare function getFilename(filepath: string): string;
export declare function isArray(arr: any): boolean;
export declare function escapeContent(content: any): any;
export declare function minifyHtml(source: any): any;
export declare function splitStringBySpace(props: any): any;
/**
 * Split attributes definition string by object for jasper client library usage
 * @param attrs                     string that represents attributes
 * @returns {name: '', type: ''}    collection of attributes
 */
export declare function getJasperAttributes(attrs: any): any;
export declare function shakeCase(name: any): any;
export declare function stringifyClientJson(def: structure.IProjectDefinition): string;
