import build = require('../../Index');
import config = require('../../lib/IJasperBuildConfig');
import file = require('../../lib/IFileUtils');
import path = require('path');


var fileUtils:file.DefaultFileUtils = new file.DefaultFileUtils();
var buildConfig = new config.DefaultBuildConfig();
buildConfig.appPath = 'test/testApp/app';
buildConfig.values = 'test/testApp/config/debug.json';
buildConfig.baseScripts = ['test/testApp/vendor/jquery.js', 'test/testApp/vendor/angular.js'];
buildConfig.startup = 'test/testApp/app/bootstrap.js';
buildConfig.baseHref = '/rootpath/';
buildConfig.singlePage = 'test/testApp/index.html';

buildConfig.jDebugEnabled = true;

buildConfig.baseCss = {
  'bootstrap.min.css': [
    'test/testApp/bootstrap.css'
  ],
  'all.min.css': [
    'test/testApp/base.css'
  ]
};

var buildManager = new build.BuildManager(buildConfig);

buildManager.buildProject();

export function setUp(done:Function) {
  done();
}

export function testInitAreasScriptCreation(test:nodeunit.Test) {
  expectFileExits(test, 'boot/_init.js');
  expectFileExits(test, 'core/_init.js');
  expectFileExits(test, 'feature/_init.js');

  test.done();
}

export function testAppConfigCreation(test:nodeunit.Test) {
  expectFileExits(test, '_areas.js');
  expectFileExits(test, '_routes.js');
  expectFileExits(test, '_values.js');

  test.done();
}

export function testAreasConfig(test:nodeunit.Test) {
  var areasConfigContent = readFile('_areas.js');
  var areasConfig = parseAreasConfig(areasConfigContent);


  test.ok(areasConfig.core);
  test.ok(areasConfig.feature);
  test.ok(areasConfig.boot);

  var scripts = areasConfig.core.scripts;

  var parts = [
    'test/testApp/scripts/custom.js',
    '//path/to/external/script.js',
    'http://another.path/to/external/script.js',

    buildConfig.appPath + '/core/pages/home-page/HomePage.js',
    buildConfig.appPath + '/core/components/site-footer/SiteFooter.js',
    buildConfig.appPath + '/core/components/site-footer/SiteFooter2.js',
    buildConfig.appPath + '/core/components/site-header/SiteHeader.js',
    buildConfig.appPath + '/core/decorators/focus-on-default/FocusOnDefault.js',
    buildConfig.appPath + '/core/_init.js'
  ];

  ensurePartsExistence(test, scripts, parts);

  scripts = areasConfig.feature.scripts;

  parts = [
    buildConfig.appPath + '/feature/components/feature-tag/FeatureTag.js',
    buildConfig.appPath + '/feature/filters/Currency/Currency.js',
    buildConfig.appPath + '/feature/decorators/red-color/RedColor.js',
    buildConfig.appPath + '/feature/_init.js'
  ];
  ensurePartsExistence(test, scripts, parts);

  scripts = areasConfig.boot.scripts;

  parts = [
    buildConfig.appPath + '/boot/components/feature-tag/BootTag.js',
    buildConfig.appPath + '/boot/_init.js'
  ];

  ensurePartsExistence(test, scripts, parts);

  test.done();
}

export function testAreasInitFiles(test:nodeunit.Test){
  /* core area */

  var areaInitContent = readFile('core/_init.js');

  var contentParts = [
    'jsp.ready(function(){ jsp.areas.initArea("core", function() { jsp.component({"ctrl":spa.core.components.SiteFooter,"name":"siteFooter","templateUrl":"test/testApp/app/core/components/site-footer/site-footer.html","jDebug":{"folder":"test/testApp/app/core/components/site-footer","scripts":["test/testApp/app/core/components/site-footer/SiteFooter2.js","test/testApp/app/core/components/site-footer/SiteFooter.js"],"styles":[]}})',
    'jsp.template(\'#_page_homePage\',\'<home-page></home-page>\')',
    'jsp.component({"ctrl":spa.core.components.SiteHeader,"properties":["myAttr"],"events":["click"],"name":"siteHeader","templateUrl":"test/testApp/app/core/components/site-header/site-header.html","jDebug":{"folder":',
    'jsp.component({"route":"/","ctrl":spa.core.pages.HomePage',
    'jsp.decorator({"ctrl":spa.core.decorators.FocusOnDefault,"name":"focusOnDefault","jDebug":{"folder":',
    'jsp.template(\'template\',\'<p>custom template</p>\');'
];

  ensurePartsExistence(test, areaInitContent, contentParts);

  /* feature area */

  areaInitContent = readFile('feature/_init.js');

  contentParts = [
    'jsp.component({"ctrl":spa.feature.components.FeatureTag,"name":"featureTag","templateUrl":"test/testApp/app/feature/components/feature-tag/feature-tag.html","jDebug":{"folder":',
    'jsp.decorator({"ctrl":spa.feature.components.RedColor,"name":"redColor","jDebug":{"folder":',
    'jsp.filter({"name":"currency","ctrl":spa.feature.filters.Currency,"jDebug":{"folder":'
  ];

  ensurePartsExistence(test, areaInitContent, contentParts);

  test.done();
}

export function testRoutesConfig(test:nodeunit.Test) {
  var routesContent = readFile('_routes.js');
  var configObject = parseRoutesConfig(routesContent);

  test.equals(configObject.defaultRoutePath, '/');
  test.ok(configObject.routes);

  test.equals(configObject.routes['/'].templateUrl, '#_page_homePage');
  test.equals(configObject.routes['/'].area, 'core');

  test.done();
}

export function testValuesConfig(test:nodeunit.Test) {
  var valuesModuleContent = readFile('_values.js');

  var contentParts = [
    'angular.module("jasperValuesConfig"',
    'v.register("arrayValue", [{"prop1":"test"},{"prop2":"test 2"}]);',
    'v.register("objectValue", {"title":"test"});',
    'v.register("numberValue", 200);',
    'v.register("stringValue", "test string");'
  ];

  ensurePartsExistence(test, valuesModuleContent, contentParts);

  test.done();
}

export function testIndexPageScripts(test:nodeunit.Test) {
  var scripts = buildConfig.baseScripts;
  scripts.push('node_modules/jdebug/lib/jdebug.js'); // jDebug script

  var indexPageContent = fileUtils.readFile(buildConfig.singlePage);
  var parts = [];
  scripts.forEach(function (path) {
    parts.push('<script src="/rootpath/' + path.replace(/\\/g, '/') + '"></script>');
  });

  ensurePartsExistence(test, indexPageContent, parts);

  test.done();
}

export function testIndexPageStyles(test:nodeunit.Test) {
  var indexPageContent = fileUtils.readFile(buildConfig.singlePage);

  var styles = fileUtils.expand(path.join(buildConfig.singlePage, '/**/*.css'));

  styles.push('node_modules/jdebug/lib/jdebug.css');//jDebug styles
  styles.push('test/testApp/base.css');
  styles.push('test/testApp/bootstrap.css');

  var parts = [];
  styles.forEach(function (path) {
    parts.push('<link rel="stylesheet" href="/rootpath/' + path.replace(/\\/g, '/') + '"/>');
  });
  ensurePartsExistence(test, indexPageContent, parts);

  test.done();
}


/* helper funcs */

function fileExists(filename:string):boolean {
  return fileUtils.fileExists(path.join(buildConfig.appPath, filename));
}

function expectFileExits(test:nodeunit.Test, filename:string) {
  test.ok(fileExists(filename));
}

function expectFileContent(test:nodeunit.Test, filename:string, content:string) {
  var filepath = path.join(buildConfig.packageOutput, filename);
  var fileContent = fileUtils.readFile(filepath);
  return test.ok(fileContent.indexOf(content) >= 0, `File content '${content}' not found in file '${filepath}'`);
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

function readFile(filepath:string):string {
  return fileUtils.readFile(path.join(buildConfig.appPath, filepath));
}

function ensurePartsExistence(test: nodeunit.Test, content: string|string[], parts: string[]) {
  parts.forEach(function (part) {
    var contentStr = typeof content === 'string' ? content.substring(0, 100) : JSON.stringify(content);
    test.ok(content.indexOf(part) >= 0, 'Part \"' + part + '\" not found in \"' + contentStr + '...\"');
  });
}

function parseRoutesConfig(content: string){
  var findConfigRegex = /jasperRouteTable\.setup\((.+)\);[^$]/g;
  var match = findConfigRegex.exec(content);
  return JSON.parse(match[1]);
}
