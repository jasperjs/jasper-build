import fs = require('fs');
import path = require('path');
import structure = require('./project/Structure');
export function camelCaseTagName(tagName:string):string {
  if (tagName.indexOf('-') < 0) {
    return camelCase(tagName);
  }

  return tagName.replace(/\-(\w)/g, function (match, letter) {
    return letter.toUpperCase();
  });
}

/**
 * ComponentName --> componentName
 */
export function camelCase(name:string):string {
  var regex = /[A-Z]/g;
  return name.replace(regex, function (letter, pos) {
    return pos ? letter : letter.toLowerCase();
  });
}

/**
 *  C:\folder\file.exe --> folder
 */
export function getParentFolderName(filepath:string):string {
  var path = this.convertPathClient(getPath(filepath));
  return path.match(/([^\/]*)\/*$/)[1];
}

/**
 *  C:\folder\file.exe --> C:\folder\
 */
export function getPath(filepath:string):string {
  return path.dirname(filepath);
}

export function getFileExtension(filepath:string):string {
  return path.extname(filepath);
}

export function convertPathClient(filepath:string):string {
  var path = filepath.replace(/\\/g, '/');
  return path;
}


export function getDirPath(filepath:string) {
  return path.dirname(filepath);
}

export function getFilename(filepath:string):string {
  return path.basename(filepath);
}

export function isArray(arr:any) {
  if (Array.isArray) {
    return Array.isArray(arr);
  } else {
    return arr instanceof Array;
  }
}

export function escapeContent(content) {
  var quotRegexp = /\'/g;
  var breaklineRegexp = /(?:\r\n|\r|\n)/g;
  var first = content.replace(/\\/g, '\\\\').replace(quotRegexp, '\\\'').replace(breaklineRegexp, ' ');
  return first;
}

export function minifyHtml(source) {
  // remove unnecessary spaces:
  var result = source.replace(/(^\s*)/gm, '');
  // remove html comments:
  result = result.replace(/<!--([\s,\S]+?)-->/g, '').trim();
  return escapeContent(result);
}

export function splitStringBySpace(props) {
  if (typeof (props) === 'string') {
    return props.split(' ').map(function (item) {
      var i = item.trim();
      return i ? i : null;
    }).filter(function (i) {
      return i;
    });
  }
  return props;
}

/**
 * Split attributes definition string by object for jasper client library usage
 * @param attrs                     string that represents attributes
 * @returns {name: '', type: ''}    collection of attributes
 */
export function getJasperAttributes(attrs) {
  if (typeof (attrs) === 'string') {
    var resultAttrs = [];

    var attrsParts = attrs.split(' ');
    attrsParts.forEach(function (part) {
      var indx = part.indexOf(':');
      if (indx > -1) {
        // attr type specified
        var attrName = part.substring(0, indx);
        var attrType = part.substring(indx + 1, part.length);
        resultAttrs.push({name: attrName, type: attrType});
      } else {
        resultAttrs.push({name: part});
      }
    });

    return resultAttrs;
  }
  return attrs;
}

export function shakeCase(name) {
  var SNAKE_CASE_REGEXP = /[A-Z]/g;
  var separator = '-';
  return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
    return (pos ? separator : '') + letter.toLowerCase();
  });
}


export function stringifyClientJson(def:structure.IProjectDefinition):string {
  // custom format to javascript to pass ctrl object instead of string
  var jsonDef = '{', delimeter = '';
  for (var prop in def) {
    if (prop.indexOf('__') === 0) continue; //private property
    if (def.hasOwnProperty(prop)) {
      var val = def[prop];
      if (prop === 'ctor' || prop === 'ctrl') {
        jsonDef += delimeter + '\"' + prop + '\"' + ':' + val + '';
      } else {
        jsonDef += delimeter + '\"' + prop + '\"' + ':' + JSON.stringify(val);
      }
      delimeter = ',';
    }
  }
  jsonDef += '}';
  return jsonDef;
}
