import project = require('./Structure');
import f = require('../IFileUtils');
import config = require('../IJasperBuildConfig');
import finder = require('../IFinder');
export interface IProjectStructureBuilder {
    buildStructure(): project.IProjectStructure;
    buildArea(areaName: string): project.IAreaDefinition;
}
export declare class ProjectStructureBuilder implements IProjectStructureBuilder {
    private fileUtils;
    private config;
    private scriptsFinder;
    private stylesFinder;
    private areaRefs;
    constructor(fileUtils: f.IFileUtils, config: config.IJasperBuildConfig, scriptsFinder: finder.IFinder, stylesFinder: finder.IFinder);
    buildStructure(): project.IProjectStructure;
    buildArea(areaName: string): project.IAreaDefinition;
    private getAreaRefs();
    private buildAreaInternal(areaRef);
    private buildAreas();
    private buildValues();
    private buildRoutesConfig(areas);
    private getAreaDefinitions(areaPath, areaName);
    private mapToDefinition(configPath, def, areaName);
    private buildJDebugInfo(path);
    private getCssTargets();
}
