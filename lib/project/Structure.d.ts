export interface IProjectDefinition {
    name: string;
    jDebug?: IJDebugInfo;
    ctrl?: string;
    ctor?: string;
    area?: string;
    attributes?: string;
    properties?: string | string[];
    events?: string | string[];
    template?: string;
    templateUrl?: string;
    templateFile?: string;
    route: string;
    eval?: boolean;
    content?: string;
    url?: string;
    __type: string;
}
/**
 * Definition of area in the project
 */
export interface IAreaDefinition {
    /**
     * Name of the area
     */
    name: string;
    /**
     * Name of dependent areas
     */
    dependencies: string[];
    /**
     * External scripts required for area
     */
    scripts: string[];
    /**
     * Definitions of the area
     */
    __definitions?: IProjectDefinition[];
    __path: string;
    /**
     * Array of area styles
     */
    __styles: string[];
}
/**
 *  Structure of the project
 */
export interface IProjectStructure {
    /**
     * Areas list
     */
    areas: IAreaDefinition[];
    routes: RoutesConfig;
    values: ValuesConfig;
    cssTargets: ICssTarget[];
}
export interface ICssTarget {
    files: string[];
    filename: string;
}
export interface IJDebugInfo {
    /**
     * Path to the folder
     */
    folder: string;
    /**
     * All scripts files in definition folder
     */
    scripts: string[];
    /**
     * All styles files in definition folder
     */
    styles: string[];
}
export declare class AreasClientOptions {
    [name: string]: any;
    toClientConfigScript(): string;
    addArea(name: string, dependencies: string[], scripts: string[]): void;
    static createFromProject(structure: IProjectStructure): AreasClientOptions;
}
export declare class AreaClientDefinition {
    dependencies: string[];
    scripts: string[];
}
export declare class RoutesConfig {
    defaultRoutePath: string;
    pages: IProjectDefinition[];
    toClientConfigScript(): string;
}
export declare class ValuesConfig {
    defaultRoutePath: string;
    values: KeyValuePair[];
    toClientConfigScript(): string;
}
export declare class KeyValuePair {
    key: string;
    value: any;
    constructor(key: string, value: any);
}
