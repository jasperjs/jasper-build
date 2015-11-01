import finder = require('./IFinder');
import cssmin = require('./tools/ICssMinifier');
import min = require('./tools/IScriptMinifier');
import file = require('./IFileUtils');
import log = require('./ILogger');
export interface ICompositionRoot {
    scriptsMinifier: min.IScriptMinifier;
    cssMinifier: cssmin.ICssMinifier;
    stylesFinder: finder.IFinder;
    scriptsFinder: finder.IFinder;
    fileUtils: file.IFileUtils;
    logger: log.ILogger;
}
export declare class JasperCompositionRoot implements ICompositionRoot {
    fileUtils: file.IFileUtils;
    scriptsMinifier: min.IScriptMinifier;
    cssMinifier: cssmin.ICssMinifier;
    stylesFinder: finder.IFinder;
    scriptsFinder: finder.IFinder;
    logger: log.ILogger;
}
