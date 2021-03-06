import project = require('./Structure');
import f = require('../IFileUtils');
import config = require('../IJasperBuildConfig');
import path = require('path');
import utils = require('../Utils');
import finder = require('../IFinder');

export interface IProjectStructureBuilder {
  buildStructure(): project.IProjectStructure;

  buildArea(areaName:string): project.IAreaDefinition;
}

export class ProjectStructureBuilder implements IProjectStructureBuilder {

  private areaRefs:IAreaReference[];

  constructor(private fileUtils:f.IFileUtils,
              private config:config.IJasperBuildConfig,
              private scriptsFinder:finder.IFinder,
              private stylesFinder:finder.IFinder) {

  }

  buildStructure():project.IProjectStructure {
    var areas = this.buildAreas();
    return {
      areas: areas,
      routes: this.buildRoutesConfig(areas),
      values: this.buildValues(),
      cssTargets: this.getCssTargets()
    };
  }

  buildArea(areaName:string):project.IAreaDefinition {
    var area = this.getAreaRefs().filter(area=>area.name === areaName)[0];
    if(!area){
      throw `Area with name '${areaName}' not found in the project`;
    }
    return this.buildAreaInternal(area);
  }

  private getAreaRefs(): IAreaReference[] {
    if (this.areaRefs) {
      return this.areaRefs;
    }
    var areasMask = path.join(this.config.appPath, '/**/_area.json');
    var areasDefinitionFiles = this.fileUtils.expand(areasMask);

    this.areaRefs = [];
    areasDefinitionFiles.forEach(defPath => {
      var areaPath = utils.getPath(defPath);
      var areaConfig = this.fileUtils.readJSON<any>(defPath);
      var areaName = areaConfig.name || utils.getParentFolderName(defPath);

      this.areaRefs.push({
        path: areaPath,
        name: areaName,
        dependencies: areaConfig.dependencies || [],
        scripts:  areaConfig.scripts || []
      });
    });

    return this.areaRefs;
  }

  private buildAreaInternal(areaRef: IAreaReference): project.IAreaDefinition{
    var area:project.IAreaDefinition = {
      dependencies: areaRef.dependencies,
      name: areaRef.name,
      scripts: areaRef.scripts.concat(this.scriptsFinder.findRecursive(areaRef.path)),

      __styles: this.stylesFinder.findRecursive(areaRef.path),
      __path: areaRef.path,
      __definitions: this.getAreaDefinitions(areaRef.path, areaRef.name)
    };

    // if we package our application, we need to collect all html templates
    if (this.config.package) {
      var templates = [];
      area.__definitions.forEach(def=> {
        if (def.templateUrl) {
          var htmlContent = this.fileUtils.readFile(def.templateUrl);
          var templateDefinition = {
            __type: 'template',
            url: def.templateUrl,
            content: utils.minifyHtml(htmlContent)
          };
          templates.push(templateDefinition);
        }
      });
      // adds templates to the area defs
      area.__definitions = area.__definitions.concat(templates);
    }
    return area;
  }

  private buildAreas():project.IAreaDefinition[] {
    var areaRefs = this.getAreaRefs();
    return areaRefs.map(ref => this.buildAreaInternal(ref));
  }

  private buildValues():project.ValuesConfig {
    if (!this.config.values) {
      return null;
    }
    if (!this.fileUtils.fileExists(this.config.values)) {
      throw `Values configuration file not found at '${this.config.values}'`;
    }
    var valuesConfig = this.fileUtils.readJSON(this.config.values);
    var result = new project.ValuesConfig();
    var keys = Object.keys(valuesConfig);
    if (keys.length) {
      keys.forEach(key => {
        result.values.push(new project.KeyValuePair(key, valuesConfig[key]));
      });
    }
    return result;
  }

  private buildRoutesConfig(areas:project.IAreaDefinition[]):project.RoutesConfig {
    var result = new project.RoutesConfig();
    result.defaultRoutePath = this.config.defaultRoutePath || '/';
    result.pages = [];

    areas.forEach(area => {
      result.pages = result.pages.concat(area.__definitions.filter(d => d.__type.toUpperCase() === 'PAGE'));
    });
    return result;
  }

  private getAreaDefinitions(areaPath:string, areaName:string):project.IProjectDefinition[] {

    var definitions:Array<project.IProjectDefinition> = [],
      areaDefMask = path.join(areaPath, '/**/_definition.json'),
      defPaths = this.fileUtils.expand(areaDefMask);

    defPaths.forEach(defPath => {
      var def = this.fileUtils.readJSON<any>(defPath);
      if (Array.isArray(def)) {
        definitions = definitions.concat(def.map((d) => this.mapToDefinition(defPath, d, areaName)));
      } else {
        definitions.push(this.mapToDefinition(defPath, def, areaName));
      }
    });
    return definitions;

  }

  private mapToDefinition(configPath:string, def:any, areaName:string):project.IProjectDefinition {
    var result:project.IProjectDefinition = def;
    result.__type = def.type || 'component';
    delete result['type'];

    if (!result.name) {
      result.name = utils.camelCaseTagName(utils.getParentFolderName(configPath));
    }

    if (result.properties || result.events) {
      if (result.properties) {
        result.properties = utils.splitStringBySpace(result.properties);
      }
      else {
        delete result.properties;
      }

      if (result.events) {
        result.events = utils.splitStringBySpace(result.events);
      } else {
        delete result.events;
      }

    }
    else {
      if (result.attributes) {
        result.attributes = utils.getJasperAttributes(result.attributes);
      } else {
        delete result.attributes;
      }
      delete result.properties;
      delete result.events;
    }

    if (result.__type.toUpperCase() === 'PAGE') {
      result.area = areaName;
    }
    //
    //def.__path = utils.getPath(config);
    var folderPath = utils.getPath(configPath);
    if (result.templateFile) {
      result.templateUrl = utils.convertPathClient(path.join(folderPath, result.templateFile));
      delete result.templateFile;
    }

    if (result.__type.toUpperCase() === 'TEMPLATE') {
      if (!result.templateUrl) {
        throw 'TemplateFile not defined in ' + configPath;
      }
      var content = this.fileUtils.readFile(result.templateUrl);
      result.content = utils.minifyHtml(content);
    }

    if (!this.config.package && this.config.jDebugEnabled) {
      result.jDebug = this.buildJDebugInfo(configPath);
    }

    return result;
  }

  private buildJDebugInfo(path:string):project.IJDebugInfo {
    var folder = utils.getPath(path);
    return {
      folder: folder,
      scripts: this.scriptsFinder.find(folder),
      styles: this.stylesFinder.find(folder)
    }
  }

  private getCssTargets():project.ICssTarget[] {
    var cssConfig = this.config.baseCss;
    if (!Array.isArray(cssConfig)) {
      var result = [];
      for (var prop in cssConfig) {
        result.push({
          filename: prop,
          files: cssConfig[prop]
        })
      }
      return result;
    }
    return [{
      filename: 'all.min.css',
      files: <string[]>cssConfig
    }];
  }

}


interface IAreaReference {
  /**
   * Name of the area
   */
  name: string;
  /**
   * Folder to area
   */
  path: string;

  dependencies: string[];

  scripts: string[];
}
