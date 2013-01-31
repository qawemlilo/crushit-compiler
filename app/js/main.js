requirejs.config({
    appDir: "../",
    
    baseUrl: 'js',
    
    shim: { 
        'app': {
            exports: 'CrushIt'
        }
    }
});

require(["app"], function(CrushIt) {  
    $(function() {
        CrushIt.init();
    });
});