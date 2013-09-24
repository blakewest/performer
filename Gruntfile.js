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
    stylus: {
      compile: {
        files: {
          'styles/style.css' : 'styles/style.styl'
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['browserify']
      },
      css: {
        files: ['styles/style.styl'],
        tasks: ['stylus']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-stylus');

  grunt.registerTask('default', 'watch');
};