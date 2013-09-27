module.exports = function(grunt) {
  grunt.initConfig ({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'public/bundle.js' : ['src/Main.js']
        }
      }
    },
    stylus: {
      compile: {
        files: {
          'public/styles/style.css' : 'styles/style.styl'
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
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', 'watch');
};