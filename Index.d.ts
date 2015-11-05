import config = require('./lib/IJasperBuildConfig');
import composition = require('./lib/ICompositionRoot');
export declare class BuildManager {
    private buildConfig;
    private root;
    private projectStructureBuilder;
    private packageBuilder;
    private areasSvc;
    private structure;
    constructor(buildConfig: config.IJasperBuildConfig, root?: composition.ICompositionRoot);
    updateConfig(buildConfig: config.IJasperBuildConfig): void;
    buildProject(): void;
    packageProject(): void;
    rebuildArea(areaName: string, rebuildRoutes?: boolean): void;
    rebuildProjectClientConfig(): void;
    static createDefaultConfig(): config.IJasperBuildConfig;
    private createStructure(userCache);
    private buildRoutesConfig(structure);
    private buildValuesConfig(structure);
    private buildAreasConfig(structure);
    private patchSinglePage(structure, areaConfigPath, routesConfigPath, valuesConfigPath);
    private validateConfig(buildConfig);
}
