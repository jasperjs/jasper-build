var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var f = require('../../../lib/IFileUtils');
var TestFileUtils = (function (_super) {
    __extends(TestFileUtils, _super);
    function TestFileUtils() {
        _super.apply(this, arguments);
        // virtual files
        this.files = [];
    }
    TestFileUtils.prototype.writeFile = function (filename, data) {
        this.files[filename] = data;
    };
    TestFileUtils.prototype.isWritten = function (filename) {
        return !!this.files[filename];
    };
    TestFileUtils.prototype.readFile = function (filename) {
        var content = this.files[filename];
        if (!content) {
            return _super.prototype.readFile.call(this, filename);
        }
        return content;
    };
    TestFileUtils.prototype.checkFileContains = function (filename, content) {
        if (!this.isWritten(filename)) {
            throw "File \"" + filename + "\" does not contain \"" + content + "\" part. File does not exist.";
        }
        var contains = this.files[filename].indexOf(content) >= 0;
        if (!contains) {
            throw "File \"" + filename + "\" does not contain \"" + content + "\" part. File content: \"" + this.files[filename] + "\"";
        }
        return true;
    };
    return TestFileUtils;
})(f.DefaultFileUtils);
exports.TestFileUtils = TestFileUtils;
