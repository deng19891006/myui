
module.exports = function(grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat:{
        options:{
          // define a string to put between each file in the concatenated output
          separator: ';'
        },
        dist: {
          // the files to concatenate
          src: ['src/**/*.js'],
          // the location of the resulting JS file
          dest: 'dist/<%= pkg.name %>.js'
        }
      }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat']);
}

