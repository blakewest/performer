module.exports = function(grunt) {
  grunt.initConfig ({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: {
          'compiled/main.js': 'coffee/main.coffee'
        }
      }
    },
    watch: {
      scripts: {
        files: 'coffee/main.coffee',
        tasks: ['coffee']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.registerTask('default', 'watch');
};