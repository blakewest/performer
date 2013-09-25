module.exports = function(grunt) {
  grunt.initConfig ({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'client/bundle.js' : ['src/Main.js']
        }
      }
    },
    stylus: {
      compile: {
        files: {
          'client/styles/style.css' : 'styles/style.styl'
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'client/', src: ['index.html', 'bundle.js'], dest: 'public/'},
          {expand: true, cwd: 'client/styles/', src: ['style.css'], dest: 'public/styles/'},
          {expand: true, cwd: 'client/lib/', src: ['**'], dest: 'public/lib/'},
          {expand: true, cwd: 'client/lib/MIDI.js/soundfont/', src: ['**'], dest: 'public/soundfont'}
          // {expand: true, src: ['lib/*'], dest: 'public/'}
          // {expand: true, src: ['lib/MIDI.js/**'], dest: 'public/'}
          // {expand: true, src: ['lib/MIDI.js/inc/jasmid/*'], dest: 'public/lib/MIDI.js/inc/jasmid', flatten: true, filter: 'isFile'},
          // {expand: true, src: ['lib/MIDI.js/inc/base64binary.js'], dest: 'public/lib/MIDI.js/inc/base64binary.js', flatten: true, filter: 'isFile'},
          // {expand: true, src: ['lib/MIDI.js/inc/SoundManager2/*'], dest: 'public/lib/MIDI.js/inc/SoundManager2', flatten: true, filter: 'isFile'}
        ]
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