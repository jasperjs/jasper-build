export interface IJasperBuildConfig {
    cwd: string;
    /**
     * Is package build?
     */
    package: boolean;
    packageOutput: string;
    singlePage: string;
    appPath: string;
    defaultRoutePath: string;
    baseScripts: string[];
    baseCss: string[] | Object;
    baseHref: string;
    /**
     * path to bootstrap file
     */
    startup: string;
    /**
     * Include MD5 hash of file content after package
     */
    fileVersion: boolean;
    /**
     * Path to client values JSON config file
     */
    values: string;
    jDebugEnabled: boolean;
    jDebugSrc: string;
    jDebugStylePath: string;
}
/**
 * Default build options
 */
export declare class DefaultBuildConfig implements IJasperBuildConfig {
    cwd: string;
    /**
     * Is package build?
     */
    package: boolean;
    packageOutput: string;
    singlePage: string;
    baseHref: string;
    values: string;
    appPath: string;
    defaultRoutePath: string;
    baseScripts: string[];
    baseCss: string[] | Object;
    /**
     * path to bootstrap file
     */
    startup: string;
    fileVersion: boolean;
    jDebugEnabled: boolean;
    jDebugSrc: string;
    jDebugStylePath: string;
    static extend(config: IJasperBuildConfig): IJasperBuildConfig;
}
