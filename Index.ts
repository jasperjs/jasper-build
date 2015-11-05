import config  = require('./lib/IJasperBuildConfig');
import composition = require('./lib/ICompositionRoot');
import p = require('./lib/PackageBuilder');
import builder = require('./lib/project/ProjectStructureBuilder');
import struct = require('./lib/project/Structure');
import areas = require('./lib/IAreaService');

import path = require('path');
import patches = require('./lib/SinglePagePatch');

export class BuildManager {

  private projectStructureBuilder:builder.ProjectStructureBuilder;
  private packageBuilder:p.PackageBuilder;
  private areasSvc:areas.AreaService;

  private structure:struct.IProjectStructure;

  constructor(private buildConfig:config.IJasperBuildConfig,
              private root:composition.ICompositionRoot = new composition.JasperCompositionRoot()) {

    this.validateConfig(buildConfig);

    this.projectStructureBuilder = new builder.ProjectStructureBuilder(
      this.root.fileUtils,
      this.buildConfig,
      this.root.scriptsFinder,
      this.root.stylesFinder);

    this.packageBuilder = new p.PackageBuilder(this.root.cssMinifier,
      this.root.scriptsMinifier,
      this.buildConfig,
      this.root.fileUtils,
      this.root.logger);

    this.areasSvc = new areas.AreaService(this.root.fileUtils);

  }

  updateConfig(buildConfig:config.IJasperBuildConfig) {
    this.buildConfig = buildConfig;
  }

  buildProject() {
    this.root.logger.info('Building jasper application...');

    this.buildConfig.package = false;
    this.createStructure(false);
    // build _init.js file of all areas
    this.areasSvc.buildAllAreas(this.structure);

    //_areas.js
    var areaConfigPath = this.buildAreasConfig(this.structure);
    //_routes.js
    var routesConfigPath = this.buildRoutesConfig(this.structure);
    //_values.js
    var valuesConfigPath:string = null;
    if (this.structure.values) {
      valuesConfigPath = this.buildValuesConfig(this.structure);
    }

    this.patchSinglePage(this.structure, areaConfigPath, routesConfigPath, valuesConfigPath);
    this.root.logger.info('Build success.');
  }

  packageProject() {
    this.buildConfig.package = true;
    this.createStructure(false);

    this.areasSvc.buildAllAreas(this.structure);

    this.packageBuilder.packageApp(this.structure);
  }

  rebuildArea(areaName:string, rebuildRoutes:boolean = true) {
    this.root.logger.info(`Rebuilding area '${areaName}'...`);
    this.createStructure(true);
    var area = this.projectStructureBuilder.buildArea(areaName);
    //build _init.js file
    this.areasSvc.buildArea(area);
    // update area def
    for (var i = 0; i < this.structure.areas.length; i++) {
      if (this.structure.areas[i].name === areaName) {
        this.structure.areas[i] = area;
        break;
      }
    }
    this.root.logger.info(`Success.'`);
  }

  rebuildProjectClientConfig() {
    this.createStructure(false);

    this.buildAreasConfig(this.structure);
    this.buildRoutesConfig(this.structure);
    if (this.structure.values) {
      this.buildValuesConfig(this.structure);
    }
  }

  static createDefaultConfig():config.IJasperBuildConfig {
    return new config.DefaultBuildConfig();
  }

  private createStructure(userCache:boolean) {
    if (!this.structure || !userCache) {
      this.structure = this.projectStructureBuilder.buildStructure();
    }
  }

  private buildRoutesConfig(structure:struct.IProjectStructure):string {
    var routeScript = structure.routes.toClientConfigScript();
    var routeConfigPath = path.join(this.buildConfig.appPath, '_routes.js');
    this.root.fileUtils.writeFile(routeConfigPath, routeScript);
    return routeConfigPath;
  }

  private buildValuesConfig(structure:struct.IProjectStructure):string {
    var valuesScript = structure.values.toClientConfigScript();
    var valuesConfigPath = path.join(this.buildConfig.appPath, '_values.js');
    this.root.fileUtils.writeFile(valuesConfigPath, valuesScript);
    return valuesConfigPath;
  }

  private buildAreasConfig(structure:struct.IProjectStructure):string {
    var areasConfig = struct.AreasClientOptions.createFromProject(structure);
    var areasScript = areasConfig.toClientConfigScript();
    var areasConfigPath = path.join(this.buildConfig.appPath, '_areas.js');
    this.root.fileUtils.writeFile(areasConfigPath, areasScript);
    return areasConfigPath;
  }

  private patchSinglePage(structure:struct.IProjectStructure, areaConfigPath:string, routesConfigPath:string, valuesConfigPath:string) {
    var patch = new patches.SinglePagePatch(this.root.fileUtils);

    var scripts = this.buildConfig.baseScripts || [];
    scripts.push(areaConfigPath);
    scripts.push(routesConfigPath);
    if (valuesConfigPath) {
      scripts.push(valuesConfigPath);
    }

    scripts.push(this.buildConfig.startup);

    if (this.buildConfig.jDebugEnabled) {
      scripts.push(this.buildConfig.jDebugSrc);
    }

    // search all app styles, first determined in config
    var styles = [];
    structure.cssTargets.forEach(target=> {
      styles = styles.concat(target.files);
    });
    // then append all areas styles
    structure.areas.forEach(area => {
      styles = styles.concat(area.__styles);
    });

    if (this.buildConfig.jDebugEnabled && this.buildConfig.jDebugStylePath) {
      styles.push(this.buildConfig.jDebugStylePath);
    }

    var content = patch.applyPatch(this.buildConfig.singlePage, this.buildConfig.baseHref, scripts, styles);

    // override
    this.root.fileUtils.writeFile(this.buildConfig.singlePage, content);
  }

  private validateConfig(buildConfig:config.IJasperBuildConfig) {

    var requiredProperties = [
      'appPath', 'singlePage'
    ];
    requiredProperties.forEach(prop=> {
      if (!buildConfig[prop]) {
        throw "Specify '" + prop + "' option.";
      }
    });

    if (!buildConfig.baseHref) {
      buildConfig.baseHref = '';
    }
  }

}
