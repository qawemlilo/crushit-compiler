/*
    CrushIt - application namespace.
*/
define(function () {
    "use strict";
    
    var CrushIt = {

        active: false,
        
        

        init: function () {
            var form = $('#crushit');
        
            form.submit(function () {
        
                // Is CrushIt at work?
                if (CrushIt.active) {
                    return false;
                } 
            
                // Crush is now at work
                CrushIt.active = true;
            
                $('#console').val('Crushing....');
                $('#loading').removeClass('loading-inactive').addClass('loading-active');
            
                CrushIt.sendRequest('/crush', form.serialize(), 'text');
            
                return false;
            });
        
            $('#console').focus(function() {
                $('#console').select();
            });
        },
        
        
        
        
        sendRequest: function (url, data, format) {
            $.post(url, data, function (code) {
                $('#console').val(code);  
                $('#loading').removeClass('loading-active').addClass('loading-inactive');
                
                CrushIt.active = false;
            }, format);        
        }
    };
  
    return CrushIt;
});