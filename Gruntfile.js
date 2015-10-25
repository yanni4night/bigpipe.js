/**
 * Copyright (C) 2015 yanni4night.com
 * Gruntfile.js
 *
 * changelog
 * 2015-10-22[18:19:17]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
      all: ['./bigpipe.*.js{,.map}']
    },
    browserify: {
      bigpipe: {
        src: 'src/bigpipe.js',
        dest: './bigpipe.src.js'
      }
    },
    uglify: {
      options: {
        sourceMap: true
      },
      bigpipe: {
        src: './bigpipe.src.js',
        dest: './bigpipe.min.js'
      }
    }
  });

  grunt.registerTask('test', []);
  grunt.registerTask('default', ['clean', 'browserify', 'uglify', 'test']);
};