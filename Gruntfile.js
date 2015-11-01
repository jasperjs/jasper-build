/*
 * grunt-jasper
 * https://github.com/jasperjs/grunt-jasper
 *
 * Copyright (c) 2015 bukharin
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-typescript');

  // Project configuration.
  grunt.initConfig({
    typescript: {
      testapp: {
        src: ['test/testApp/app/**/*.ts'],
        options: {
          module: 'amd', //or commonjs
          target: 'es5', //or es3
          sourceMap: false,
          declaration: false,
          references: [ 'typed/*.d.ts']
        }
      },
      lib: {
        options: {
          module: 'commonjs', //or commonjs
          target: 'es5', //or es3
          sourceMap: false,
          declaration: false,
          references: [ 'typed/**/*.d.ts'],
          generateTsConfig: true
        },
        src: ['Index.ts', 'lib/**/*.ts', 'test/unit/**/*.ts', 'test/build/**/*.ts', 'test/package/**/*.ts']
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: [
        'test/testApp/app/_values.js',
        'test/testApp/app/_areas.js',
        'test/testApp/app/_routes.js',
        'test/testApp/dist/**/*.*',
        'test/testApp/**/_init.js'
      ]
    },

    // Unit tests.
    nodeunit: {
      build: ['test/build/*.tests.js'],
      package: ['test/package/*.tests.js'],
      unit: ['test/unit/*.js']
    }

  });

  grunt.registerTask('test-build', ['clean', 'nodeunit:build']);
  grunt.registerTask('test-package', ['clean', 'nodeunit:package']);
  grunt.registerTask('test-unit', ['clean', 'nodeunit:unit']);

  grunt.registerTask('test', ['typescript', 'test-unit', 'test-build', 'test-package']);

  grunt.registerTask('default', ['typescript:lib']);

};
