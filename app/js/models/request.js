
define(['../libs/backbone'], function (Backbone) {
    "use strict";
    
    var Request = Backbone.Model.extend({
        defaults: {
            data: ''
        }
    });
    
    return Request;
});