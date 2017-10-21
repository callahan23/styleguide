module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-kss');

    var env = grunt.option('env') || 'dev';

    grunt.initConfig({

        watch : {
            assets : {
                files :   [
                    'src/**', '!**/*.*'

                ],
			tasks :   [ 'copy:assets', 'kss' ],
                options : {
                    livereload : true
                }
            },

            styles_kss : {
                files :   [
                    'src/**/*.less', 'src/less/**/*.html'
                ],
                tasks :   [ 'kss' ],
                options : {
                    livereload : true
                }
            }
        },

        copy : {
            assets : {
                files : [
                    {
                        expand : true,
                        cwd :    'src',
                        src :    [
                            '**/*'
                        ],
                        dest :   'web'
                    }
                ]
            }
        },

        kss : {
            options : {
                verbose : true,
                css: '../web/css/*',
                title: 'GDTS Styleguide',
                builder: 'styleguide-theme'

            },
            dist :    {
                src :  ['src/less'],
                dest : 'styleguide'
            }
        }
    });

    // Build Tasks
    var buildEssentialTasks = [ 'copy' ];

    grunt.registerTask('build_essentials', buildEssentialTasks);
    grunt.registerTask('build_complete', [ 'build_essentials', 'kss' ]);

    // Dev Tasks
    grunt.registerTask('dev', function () {
        delete grunt.config.data.watch.styles_kss;
        grunt.task.run([ 'build_essentials', 'watch' ]);
    });
    grunt.registerTask('dev_complete', [ 'build_complete', 'watch' ]);

    // Default Task => build_complete
    grunt.registerTask('default', [ 'build_complete', 'watch' ]);
};
