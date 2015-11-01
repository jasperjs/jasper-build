import project = require('./project/Structure');
import cssmin = require('./Tools/ICssMinifier');
import min = require('./Tools/IScriptMinifier');
import config = require('./IJasperBuildConfig');
import files = require('./IFileUtils');
import log = require('./ILogger');
export interface IPackageBuilder {
    packageApp(structure: project.IProjectStructure): any;
}
export declare class PackageBuilder implements IPackageBuilder {
    private cssMinifier;
    private scriptsMinifier;
    private jasperConfig;
    private fileUtils;
    private logger;
    private scriptsFolder;
    constructor(cssMinifier: cssmin.ICssMinifier, scriptsMinifier: min.IScriptMinifier, jasperConfig: config.IJasperBuildConfig, fileUtils: files.IFileUtils, logger: log.ILogger);
    packageApp(structure: project.IProjectStructure): void;
    private packageBaseScripts();
    private buildStartupScript(structure, areasConfig);
    /**
     *  Search all app files
     */
    private packageStyles(structure);
    /**
     * Concat and minify all areas scripts
     */
    private packageAreasScripts(structure);
    private getFileVersion(content);
    private isAbsUrl(url);
    /**
     * Excludes from @scripts absolutes script paths and returns array of excluded paths
     * @param scripts   Array of scripts
     */
    private excludeAbsScripts(scripts);
    private patchSinglePage(scripts, styles);
}
