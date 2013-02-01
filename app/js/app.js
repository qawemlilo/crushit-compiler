/*
    CrushIt - application namespace.
*/
define(['views/left-panel'], function (Panel) {
    "use strict";
    
    var CrushIt = {
        init: function () {
            var panel = new Panel();
        }
    };
  
    return CrushIt;
})