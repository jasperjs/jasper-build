import fs = require('fs');
import glob = require('glob');
import path = require('path');
import config = require('./IJasperBuildConfig');

export interface IFileUtils {

  readJSON<T>(filename:string): T;

  writeJSON(filename:string, data:any);

  readFile(filename:string): string;

  writeFile(filename:string, data:string);

  fileExists(filename:string): boolean;

  expand(pattern:string): string[];

  concat(filenames:string[]): string;
}

export class DefaultFileUtils implements IFileUtils {

  constructor(private cwd?:string) {
    if (!this.cwd) {
      this.cwd = process.cwd();
    }
  }

  readJSON<T>(filename:string):T {
    var content = this.readFile(filename);
    if (!content) {
      return null;
    }
    return JSON.parse(content);
  }

  writeJSON(filename:string, data:any) {
    var content = JSON.stringify(data, null, 4);
    this.writeFile(filename, content);
  }

  readFile(filename:string):string {
    var content = fs.readFileSync(filename, {encoding: 'utf8'});
    content = content.replace(/^\uFEFF/, ''); //remove BOM
    return content;
  }

  writeFile(filename:string, data:string) {
    var directoryPath = path.dirname(filename);
    if (!this.dirExists(directoryPath)) {
      this.mkDirRecursive(directoryPath);
    }
    return fs.writeFileSync(filename, data, {encoding: 'utf8'});
  }

  fileExists(filename:string):boolean {
    try {
      return fs.statSync(filename).isFile();
    }
    catch (err) {
      return false;
    }
  }

  expand(pattern:string):string[] {
    return glob.sync(pattern, {cwd: this.cwd});
  }

  concat(filenames:string[]):string {
    // Iterate over all src-dest file pairs.
    var buffer = '';
    filenames.forEach((filename:string) => {
      if (!this.fileExists(filename)) {
        throw `File "${filename}" does not exists`;
      }
      buffer += '\n' + this.readFile(filename);
    });
    return buffer;
  }

  private dirExists(folderpath:string):boolean {
    try {
      return fs.statSync(folderpath).isDirectory();
    }
    catch (err) {
      return false;
    }
  }

  private mkDirRecursive(dirPath:string, mode?:string) {


    //Call the standard fs.mkdir
    try {
      fs.mkdirSync(dirPath, mode);
    }
    catch (error) {
      //When it fail in this way, do the custom steps
      if (error && error.code === 'ENOENT') {
        //Create all the parents recursively
        this.mkDirRecursive(path.dirname(dirPath), mode);
        //And then the directory
        this.mkDirRecursive(dirPath, mode);
      }
    }


  }
}
