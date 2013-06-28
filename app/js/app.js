/*
    CrushIt - application namespace.
*/
define(['views/left-panel'], function (Panel) {
    "use strict";
    
    var CrushIt = function () {};
    
    CrushIt.prototype.init = function () {
        this.leftPanel = new Panel();
    };
  
    return new CrushIt();
})