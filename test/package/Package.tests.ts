import build = require('../../Index');
import config = require('../../lib/IJasperBuildConfig');
import file = require('../../lib/IFileUtils');
import path = require('path');


var fileUtils:file.DefaultFileUtils = new file.DefaultFileUtils();
var buildConfig = new config.DefaultBuildConfig();
buildConfig.appPath = 'test/testApp/app';
buildConfig.values = 'test/testApp/config/debug.json';
buildConfig.packageOutput = 'test/testApp/dist';
buildConfig.baseScripts = ['test/testApp/vendor/jquery.js', 'test/testApp/vendor/angular.js'];
buildConfig.startup = 'test/testApp/app/bootstrap.js';
buildConfig.baseHref = '/rootpath/';
buildConfig.singlePage = 'test/testApp/index.html';

buildConfig.baseCss = {
  'bootstrap.min.css': [
    'test/testApp/bootstrap.css'
  ],
  'all.min.css': [
    'test/testApp/base.css'
  ]
};

var buildManager = new build.BuildManager(buildConfig);

buildManager.packageProject();

export function setUp(done:Function) {


  done();
}

export function testStylesCreation(test:nodeunit.Test) {
  test.ok(fileExists('styles/bootstrap.min.css'));
  test.ok(fileExists('styles/all.min.css'));

  expectFileContent(test, 'styles/bootstrap.min.css', 'bootstrap-css:true');
  expectFileContent(test, 'styles/all.min.css', 'p{color:red}.b-site-header{font-size:18px;color:green}');

  test.done();
}

export function testScriptsCreation(test:nodeunit.Test) {
  var scripts = [
    '_base.*.min.js',
    '_startup.*.min.js',

    'boot.*.min.js',
    'core.*.min.js',
    'feature.*.min.js',
  ];

  scripts.forEach(script => {
    test.ok(fileExistsGlob('scripts/' + script));
  });

  test.done();
}

export function testCorrectScriptCreation(test:nodeunit.Test) {
  var baseContent = readFileGlob('scripts/_base.*.min.js');
  expectContent(test, baseContent, `console.log("jquery"),console.log("angular");`);
  test.done();
}

export function testCorrectStartupScript(test:nodeunit.Test) {
  var content = readFileGlob('scripts/_startup.*.min.js');
  var configObject = parseAreasConfig(content);

  test.ok(configObject.core);
  test.ok(configObject.feature);
  test.ok(configObject.boot);

  // test external scripts:
  test.ok(configObject.core.scripts.length === 3, 'Core area must contains 3 scripts after package: 1 area script and 2 external scripts');
  test.ok(configObject.core.scripts[0] === 'http://another.path/to/external/script.js', 'Core area must contains external script');
  test.ok(configObject.core.scripts[1] === '//path/to/external/script.js', 'Core area must contains external script');
  test.ok(configObject.core.scripts[2].indexOf('/rootpath/scripts/core.') === 0, 'Core area must contains area script');

  test.deepEqual(configObject.boot.dependencies, []);
  test.ok(configObject.boot.scripts[0].indexOf('/rootpath/scripts/boot.') === 0);

  test.deepEqual(configObject.feature.dependencies, ['core']);
  test.ok(configObject.feature.scripts[0].indexOf('/rootpath/scripts/feature.') === 0);

  //ensure that bootstrap file appends to the end
  test.ok(/angular\.bootstrap\(document,"app"\);$/.test(content), 'bootstrap script must be referenced at the end of _startup script');
  //ensure that routes config is references in _startup
  test.ok(/angular\.module\("jasperRouteConfig",\["jasper"\]\)/.test(content), 'routes config must be referenced in _startup file');

  test.done();
}

export function testHtmlCommentRemoving(test:nodeunit.Test){
  var coreFileContent = readFileGlob('scripts/core.*.min.js');
  test.ok(coreFileContent.indexOf('<!-- $$test comment$$ -->') < 0);
  test.done();
}

export function testAreaInitScriptsInAreaFiles(test:nodeunit.Test){
  expectFileContentGlob(test, 'scripts/core.*.min.js', 'jsp.areas.initArea("core",function()');
  expectFileContentGlob(test, 'scripts/feature.*.min.js', 'jsp.areas.initArea("feature",function()');
  expectFileContentGlob(test, 'scripts/boot.*.min.js', 'jsp.areas.initArea("boot",function()');
  //
  test.done();
}

export function testEpcapingSlash(test: nodeunit.Test){
    var coreFileContent = readFileGlob('scripts/core.*.min.js');
    test.ok(coreFileContent.indexOf('\\\\testattrvalue\\\\') > 0, 'core.min.js must escape slash');
    test.done();
}

export function testCorePackagedAreaMustContainsExternalScript(test: nodeunit.Test){
  var coreFileContent = readFileGlob('scripts/core.*.min.js');
  test.ok(coreFileContent.indexOf('console.log("custom script");') === 0, 'core.min.js must contains external script at first');
  test.done();
}

export function testPackageAreasContainsTemplates(test: nodeunit.Test){
  expectFileContentGlob(test, 'scripts/core.*.min.js', '<p>custom template</p>');
  expectFileContentGlob(test, 'scripts/core.*.min.js', 'jsp.template("test/testApp/app/core/components/site-footer/site-footer.html",');

  expectFileContentGlob(test, 'scripts/feature.*.min.js', 'jsp.template("test/testApp/app/feature/components/feature-tag/feature-tag.html"');
  expectFileContentGlob(test, 'scripts/boot.*.min.js', 'jsp.template("test/testApp/app/boot/components/feature-tag/boot-tag.html"');

  test.done();
}

export function testIndexPageReferences(test: nodeunit.Test){
  //styles
  expectFileContent(test, 'index.html', '<link rel="stylesheet" href="/rootpath/test/testApp/dist/styles/bootstrap.min.css"/>');
  expectFileContent(test, 'index.html', '<link rel="stylesheet" href="/rootpath/test/testApp/dist/styles/all.min.css"/>');

  //scripts
  expectFileContent(test, 'index.html', '<script src="/rootpath/test/testApp/dist/scripts/_base');
  expectFileContent(test, 'index.html', '<script src="/rootpath/test/testApp/dist/scripts/_startup');

  test.done();
}

//

function fileExists(filename:string):boolean {
  return fileUtils.fileExists(path.join(buildConfig.packageOutput, filename));
}

function fileExistsGlob(mask:string):boolean {
  mask = path.join(buildConfig.packageOutput, mask);
  var files = fileUtils.expand(mask);
  return files.length === 1;
}

function readFileGlob(mask:string):string {
  mask = path.join(buildConfig.packageOutput, mask);
  var files = fileUtils.expand(mask);
  return fileUtils.readFile(files[0]);
}

function expectFileContent(test:nodeunit.Test, filename:string, content:string) {
  var filepath = path.join(buildConfig.packageOutput, filename);
  var fileContent = fileUtils.readFile(filepath);
  return test.ok(fileContent.indexOf(content) >= 0, `File content '${content}' not found in file '${filepath}'`);
}

function expectFileContentGlob(test:nodeunit.Test, filename:string, content:string) {
  var fileContent = readFileGlob(filename);
  expectContent(test, fileContent, content);
}

function expectContent(test:nodeunit.Test, allContent:string, content:string) {
  return test.ok(allContent.indexOf(content) >= 0, `Content part '${content}' not found in '${allContent}'`);
}

function parseAreasConfig(content:string):any {
  var findConfigRegex = /value\("\$jasperAreasConfig",(.+)\)\s*\.run/g;
  var match = findConfigRegex.exec(content);
  eval(`global.foo = ${match[1]}`);
  return global['foo'];
}
