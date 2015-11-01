import f = require("./IFileUtils");
import structure = require("./project/Structure");
export interface IAreaService {
    /**
     * Builds _init.js file in area folder
     * @param areaName
     */
    buildArea(area: structure.IAreaDefinition): any;
    /**
     * Build _init.js for all areas found in projet
     */
    buildAllAreas(structure: structure.IProjectStructure): any;
    /**
     *  Build _areas.js client configuration
     */
    buildAreasConfig(): string;
}
export declare class AreaService implements IAreaService {
    private fileUtils;
    constructor(fileUtils: f.IFileUtils);
    buildAllAreas(structure: structure.IProjectStructure): void;
    buildAreasConfig(): string;
    buildArea(area: structure.IAreaDefinition): void;
    private getRegistrationScript(def);
    private getAreaByName(name, structure);
    private componentRegistration(component);
    private decoratorRegistration(component);
    private filterRegistration(component);
    private serviceRegistration(component);
    private registerByMethod(methodName, componentJsonDef);
    private templateRegistration(url, content);
}
