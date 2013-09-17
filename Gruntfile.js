module.exports = function(grunt) {
  grunt.initConfig ({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'build/bundle.js' : ['src/Main.js']
        }
      }
    },
    watch: {
      scripts: {
        files: 'src/**/*.js',
        tasks: ['browserify']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', 'watch');
};