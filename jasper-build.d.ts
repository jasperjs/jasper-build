/**
 * Type definition for external modules
 */

declare var a:any;
declare module "jasper-build" {

  export interface IJasperBuildConfig {
    cwd: string;
    /**
     * Is package build?
     */
      package: boolean;

    packageOutput: string;

    singlePage: string;

    /**
     * Name of the build process
     */
    buildName: string;

    appPath: string;

    defaultRoutePath: string;

    baseScripts: string[];
    baseCss: string[]|Object;

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

    jDebugEnabled: boolean; //false,
    jDebugSrc: string; // 'node_modules/jdebug/lib/jdebug.js',
    jDebugStylePath: string; // 'node_modules/jdebug/lib/jdebug.css'
  }

  export interface ICompositionRoot {

    scriptsMinifier: any;
    cssMinifier: any;

    stylesFinder: any;
    scriptsFinder: any;

    fileUtils: any;

    logger: any;
  }


  export class BuildManager {
    constructor(buildConfig:IJasperBuildConfig, root?:ICompositionRoot);

    buildProject():void;

    packageProject():void;

    rebuildArea(areaName:string, rebuildRoutes?:boolean);

    updateConfig(buildConfig:IJasperBuildConfig);

    static createDefaultConfig():IJasperBuildConfig;
  }


}
