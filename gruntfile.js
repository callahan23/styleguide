// Grunt ist der im Projekt vorgegebene Taskrunner. In dieser Datei werden
// die einzelnen Tasks definiert, die Grunt automatisch, z.B. bei Änderungen
// des Quellcodes ausführt.
module.exports = function (grunt) {
    // Lade über npm installierte "PlugIns", die die Grundfunktionalität von
    // Grunt erweitern.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // macht Grunt less-fähig.
    // Im Projekt wird less verwendet, das für den Browser zu css kompiliert
    // wird. less ist eine Erweiterung zu css, die z.B. eine Verwendung von
    // Variablen, Mixins, etc. ermöglicht.
    grunt.loadNpmTasks('grunt-contrib-less');
    // erweitert Grunt um die Fähigkeit automatisch den Styleguide Generator
    // kss auszuführen.
    grunt.loadNpmTasks('grunt-kss');
    // "Umgebungsvariable" um unterschiedliche Tasks für Production und
    // Development ausführen zu können (wird derzeit noch nicht verwendet)
    var env = grunt.option('env') || 'dev';

    // initialisiere Grunt Tasks:
    grunt.initConfig({
        // Überwache Dateisystem auf Änderungen
        watch : {
              // bei Änderungen an less Dateien starte less task (siehe unten)
              less: {
                  files: ['src/**/*.less'],
                  tasks: ['less']
              },
              // bei Änderungen der Ordnerstruktur im Sourcedirectory starte
              // Copy - und kss Task.
            assets : {
                files :   [
                    'src/**',
                    '!**/*.*',
                ],
                tasks :   [ 'copy:assets', 'kss' ],
                options : {
                    // wird bisher noch nicht verwendet
                    livereload : true
                }
            },
            // bei Änderungen an less- oder HTML Files starte kss Task
            styles_kss : {
                files :   [
                    'src/**/*.less', 'src/less/**/*.html'
                ],
                tasks :   [ 'kss' ],
                options : {
                    // wird bisher noch nicht verwendet
                    livereload : true
                }
            }
        },
            // less Task: verwende alle less Files im Sourcedirectory und
            // kompiliere in eine einzige css Datei.
            less: {
                files: {
                    src: 'src/**/*.less',
                    dest: 'web/css/index.css'
                }
            },
            // copy Task: kopiere bei Änderungen im Dateisystem alle Dateien
            // außer less Dateien ins web Verzeichnis.
            copy : {
            assets : {
                files : [
                    {
                        expand : true,
                        cwd :    'src',
                        src :    [
                            '**/*',
                            '!**/*.less'
                        ],
                        dest :   'web'
                    }
                ]
            }
        },
        // kss Task: rufe kss auf, mit folgenden zusätzlichen Argumenten:
        // -verbose: ausführliches Logging
        // -css: das zu verwendende Stylesheet
        // -title: Seitentitel für die Styleguide Seite
        // -builder: Pfad zum zu verwendenden Styleguide-Builder
        kss : {
            options : {
                verbose : true,
                css: '../web/css/index.css',
                title: 'GDTS Styleguide',
                builder: 'styleguide-theme'

            },
            // -src: die, für die Styleguidegenerierung verwendeten less-Dateien
            // -dest: Pfad, wo der Styleguide hin generiert wird
            dist :    {
                src :  ['src/less'],
                dest : 'styleguide'
            }
        }
    });

    // Verschiedene Möglichkeiten Grunt aufzurufen:
    // Build Tasks
    var buildEssentialTasks = [ 'copy' ];

    grunt.registerTask('build_essentials', buildEssentialTasks);
    grunt.registerTask('build_complete', [ 'build_essentials', 'less', 'kss' ]);

    // Dev Tasks
    grunt.registerTask('dev', function () {
        delete grunt.config.data.watch.styles_kss;
        grunt.task.run([ 'build_essentials', 'watch' ]);
    });
    grunt.registerTask('dev_complete', [ 'build_complete', 'watch' ]);

    // Default Task => build_complete
    grunt.registerTask('default', [ 'build_complete', 'watch' ]);
};
