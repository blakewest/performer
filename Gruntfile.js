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
          'public/styles/style.css' : 'public/styles/style.styl'
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['browserify']
      },
      css: {
        files: ['public/styles/style.styl'],
        tasks: ['stylus']
      }
    },
    uglify: {
      my_target: {
        files: {
          'public/bundle.min.js' : ['public/bundle.js']
        }
      }
    },
    concat: {
      dist: {
        src: ['public/lib/MIDI.js/build/MIDI.min.js', 'public/lib/MIDI.js/inc/base64binary.js', 'public/lib/MIDI.js/inc/jasmid/midifile.js', 'public/lib/MIDI.js/inc/jasmid/stream.js',
                'public/lib/MIDI.js/inc/jasmid/replayer.js', 'public/lib/three.min.js', 'public/lib/Detector.js',
                'public/bundle.min.js', 'public/lib/tween.min.js', 'public/lib/bootstrap.min.js', 'public/lib/TrackballControls.js'],
        dest: 'public/build.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', 'watch');
};