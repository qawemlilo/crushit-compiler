
;(function () {
    "use strict";
    
    var Console = {
    
        el: $('#console'),
        
        
        init: function () {
            var self = this;
            
            self.el.on('focus', function () {
                self.selectConsole();
            });
            
            return self;
        },


        
        update: function (data) {
            this.el.val(data);
            
            return this;
        },
        
        
        
        selectConsole: function () {
            this.el.select();
            
            return this;
        }
    };


    
    
    var el = $('#left-panel'); 
    
    var Panel = {
        
        active: false,
        
        
        showingError: false,
        
        
        terminalHandle: null,
        
        
        
        events: function () {
            var self = this;
            
            el.on('submit', '#crushit', function (e) {
                self.crushIt(e);
            })
            .on('focus', '#url', function (e) {
                self.onUrlFocus(e);
            })
            .on('blur', '#url', function (e) {
                self.onUrlBlur(e);
            })
            .on('change', '#max', function (e) {
                self.onOptionsChange(e);
            })
            .on('change', '#comments', function (e) {
                self.onOptionsChange(e);
            })
            .on('change', '#beautify', function (e) {
                self.onOptionsChange(e);
            });
        },
        
        
        
        initialize: function () {
            this.console = Console.init();
            
            el.on('init', this.init);
            el.on('loading', this.loading);
            el.on('loaded', this.loaded);
            el.on('error', this.onError);

            this.blink();            
        },
        
        
        
        
        crushIt: function (e) {
            e.preventDefault();
            
            // Is CrushIt at work?
            if (this.active) {
                return false;
            }
            
            el.trigger('init');  
            
            var self = this, 
                url = el.find("#url").val(), 
                query = el.find('#crushit').serialize();
            
            self.switchOfBlinker();
            
            self.runTerminal(url, function () {
                el.trigger('loading');
                self.sendRequest('http://crushit-compiler.herokuapp.com/crush', query, 'text', url);
            });
        },
        
        
        
        sendRequest: function (url, data, format, cacheUrl) {
            var self = this;
            
            $.post(url, data, format)
            
            .done(function (code) {
                self.console.update(code);
                el.trigger('loaded');  
            })
            
            .fail(function (xhr) {
                el.trigger('error');
                self.console.update(xhr.responseText);
            });        
        },
        
        
        
        
        loading: function () {
            if (this.showingError) {
                $('#console').removeClass('error');
                this.showingError = false;
            }
            
            this.console.update('Crushing scripts....');
            
            $('#loading').removeClass('loading-inactive').addClass('loading-active');
            this.active = true;
        },

        
        
        init: function () {
            el.find('#submit').addClass('disabled').attr('disabled', 'disabled');
            this.active = true; 
        },
        
        
        
        loaded: function () {
            this.reset();
        },
        
        
        
        
        reset: function () {
            el.find('#submit').removeClass('disabled').attr('disabled', false);        
            $('#loading').removeClass('loading-active').addClass('loading-inactive'); 
            this.active = false;            
        },
        
        
        
        onError: function () {
            $('#console').addClass('error');
            this.showingError = true;
            this.reset();
        },
        


        onUrlFocus: function () {           
            if (this.active) {
                return false;
            }
            el.find('#url').val('');
            this.console.update('');
            this.switchOfBlinker();
        },
        
        
        
 
        onUrlBlur: function () {
            if (!$('#url').val() && !this.active) {
                this.blink();
            }
        },
        
        
        
        
        onOptionsChange: function () {
            if ($('#max').is(':checked')) {
                el.find('#comments, #beautify').attr("checked", false);
            }
        },
        
        
        
        runTerminal: function (url, next) {
            var command = this.getCommand(url), 
                terminal = el.find('#crushit-command');
            
            terminal.text("");
            
            $({count: 0}).animate({count: command.length}, {
                duration: 2000,
                step: function() {
                    terminal.text(command.substring(0, Math.round(this.count)));
                }
            })
            .promise()
            .done(next);
        },
        
        
        
        
        getCommand: function (url) {
            var command = 'crushit ';
            
            if ($('#max').is(':checked')) {
               return command += '-m ' + url;
            }
            
            if ($('#beautify').is(':checked') && $('#comments').is(':checked')) {
               return command += '-bc ' + url;
            }
            
            if ($('#beautify').is(':checked')) {
               return command += '-b ' + url;
            }

            if ($('#comments').is(':checked')) {
               return command += '-c ' + url;
            }

            
             return command += url;          
        },
        
        

        blink: function () {
            var self = this, terminal = el.find('#crushit-command'), on = false;

                
            self.terminalHandle = setInterval(function () {
                if (on) { 
                    terminal.text('');
                    on = false;
                }
                else {
                    terminal.text('_');
                    on = true;
                }  
            }, 500);
        },



        switchOfBlinker: function () {
            clearInterval(this.terminalHandle);
            this.terminalHandle = null;
            el.find('#crushit-command').text('');          
        }        
    };
    
    Panel.initialize();
})();