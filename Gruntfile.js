module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    transport : {
	    options : {
    	   	  paths:['component'],
   	        alias:{
          		"jquery": "../lib/jquery-1.10.1.min.js",
        		  "util":"../lib/util.js"
       	    }
	    },
	    component: {
            files: [{
            	  cwd : 'component',
                src : '**/js/*.js',
               dest : '.build'
            }]
      },
      app_index : {
            files: [{
                src : 'app/index.js',
               dest : '.build'
            }]
      }
    },

    concat:{
        options: {
            separator: '\n'
        },    
        scripts:{
        	// cwd : '.build',
             src : ['.build/**/*.js','!.build/**/*-debug.js','!.build/app/*.js'],
            dest : '.build/myui.js'
        },
        styles:{
        	// cwd : 'component',
			       src : ['component/**/style/*.css'],
            dest : '.build/myui.css'
        }
        ,
        app_index:{
             src : ['.build/app/index.js','.build/myui.js'],
             dest : 'app/app_index.js'
        }
    },

    uglify: {
      	options: {
        	banner: '/* \n'+
                  ' * name : <%= pkg.name %> \n'+
                  ' * version : <%= pkg.version %> \n'+
                  ' * author : <%= pkg.author %>  <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> \n'+
                  ' */\n'
        },
     	  scripts: {
       	 	src: '.build/myui.js',
       	 	dest:'dist/myui.min.js'
      	}
    },

    cssmin: {
	    // combine: {
	    // 	files: {
	    //  		'dest/myui.min.css': ['.build/myui.css']
	    //     }
	    // },
	    minify: {
		    // expand: true,
		    src: ['.build/myui.css'],
		    dest: 'dist/myui.min.css'
	   	}
    },

    clean: [".build"] 
    
});

grunt.loadNpmTasks('grunt-cmd-transport');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.registerTask('default', ['transport','concat','uglify','cssmin','clean']);
// grunt.registerTask('default', ['transport','concat','uglify']);
 
}

