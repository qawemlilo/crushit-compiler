requirejs.config({
    appDir: "../",
    
    baseUrl: 'js',
    
    shim: {
        'libs/underscore': {
            exports: '_'
        },
        
        'libs/backbone': {
            deps: ['libs/underscore'],
            exports: 'Backbone'
        },
        
        'app': {
            deps: ['libs/underscore', 'libs/backbone'],
            exports: 'CrushIt'
        }
    }
});

require(["app"], function(CrushIt) {  
    $(function() {
        CrushIt.init();
    });
});