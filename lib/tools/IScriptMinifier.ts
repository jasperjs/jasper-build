import UglifyJS = require("uglify-js");
import files = require('../IFileUtils');

export interface IScriptMinifier {
  /**
   * Minify @sourceFiles to @outputFile
   */
  minify(source:string, outputFile:string);
}

export class UglifyJsMinifier implements IScriptMinifier {

  constructor(private fileUtils:files.IFileUtils) {

  }

  minify(source:string, outputFile:string) {
    var result: any = null;
    try {
      result = UglifyJS.minify(source, {fromString: true});
    }
    catch (e) {
      console.error('Error during script minification: ', source.substring(e.pos - 10, e.pos + 100));
      throw e;
    }

    this.fileUtils.writeFile(outputFile, result.code);
  }

}
