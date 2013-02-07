
define(function() {
    "use strict";
    
    var Console = Backbone.View.extend({
    
        el: $('#console'),
        
        
        events: {
            'focus': 'selectConsole',
            'click': 'selectConsole'            
        },


        
        update: function (data) {
            this.$el.val(data);
            
            return this;
        },
        
        
        
        selectConsole: function () {
            this.$el.select();
        }
    });
    
    return Console;
})