$(function () {
    "use strict";
    
    var display = $('#console'),
        terminalHandle = null,
        myCodeMirror,
        App; 
        
    
    App = {
    
        el: $('#left-panel'),
        
        
        active: false,
        
        
        blinking: false,
        
        
        showingError: false,

    
        update: function (data) {
            myCodeMirror.setValue(data);
        },
        
        
        initialize: function () {
            var self = this;
            
            self.el.on('init', function () {
                self.initialize();
            })
            .on('loading', function () {
                self.loading();
            })
            .on('loaded', function () {
                self.loaded();
            })
            .on('error', function () {
                self.onError();
            });
            
            $('#crushit').on('submit', function (e) {
                self.crushIt(e);
            });
            
            $('#url').on('focus', function () {
                if (self.active) {
                    console.log('active');
                    return false;
                }
                
                //$('#url').val('');
                document.forms.crushit.reset();
                self.update('');
                self.switchOfBlinker();
            })
            .on('blur', function () {
                if (!$('#url').val() && !self.active) {
                    self.blink();
                }
            });
            
            $('#max').on('change', function () {
                self.onOptionsChange('max');
            });
            
            $('#mangle').on('change', function () {
                self.onOptionsChange('mangle');
            });
            
            $('#comments').on('change', function () {
                self.onOptionsChange('comments');
            });
            
            $('#beautify').on('change', function () {
                self.onOptionsChange('beautify');
            });
            
            
            self.blink();            
        },
        
        
        crushIt: function (e) {
            e.preventDefault();
            
            // Is CrushIt at work?
            if (this.active) {
                return false;
            }
            
            var self = this, 
                url = self.el.find("#url").val(), 
                query = self.el.find('#crushit').serialize();
            
            self.runTerminal(url, function () {
                self.el.trigger('loading');
                self.sendRequest('/crush', query, 'text', url);
            });
        },
        
        
        sendRequest: function (url, data, format) {
            var self = this;
            
            $.post(url, data, format)
            
            .done(function (code) {
                self.update(code);
                self.el.trigger('loaded');  
            })
            
            .fail(function (xhr) {
                self.update(xhr.responseText);
                self.el.trigger('error');
            });        
        },
        
        
        loading: function () {
            if (this.showingError) {
                this.showingError = false;
                display.removeClass('error');
            }
            
            $('#loading').removeClass('loading-inactive').addClass('loading-active');
            this.active = true;
        },
        
        
        loaded: function () {
            this.reset();
        },
        
        
        reset: function () {
            this.el.find('#submit').removeClass('disabled').attr('disabled', false);        
            $('#loading').removeClass('loading-active').addClass('loading-inactive'); 
            this.active = false;            
        },
        
        
        onError: function () {
            display.addClass('error');
            this.showingError = true;
            this.reset();
        },
        
        onOptionsChange: function (box) {
            var mm = this.el.find('#max, #mangle'),
                bc = this.el.find('#comments, #beautify');
            
            if (($('#max').is(':checked') || $('#mangle').is(':checked')) && (box === 'comments' || box === 'beautify')) {
                mm.attr("checked", false);
            }
            if (($('#comments').is(':checked') || $('#beautify').is(':checked')) && (box === 'max' || box === 'mangle')) {
                bc.attr("checked", false);
                
                if(box === 'mangle' && !$('#max').is(':checked')) {
                    this.el.find('#max').attr("checked", true);
                }
            }
        },
        
        
        runTerminal: function (url, next) {
            var command = this.getCommand(url), 
                terminal = this.el.find('#crushit-command');
            
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
            
            if ($('#max').is(':checked') && $('#mangle').is(':checked')) {
               return command += '-xm ' + url;
            }
            
            if ($('#max').is(':checked')) {
               return command += '-x ' + url;
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
            if (this.blinking || this.active) {
                return false;
            }
            
            var terminal = $('#crushit-command'), on = false;
            
            this.blinking = true;
                
            terminalHandle = setInterval(function () {
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
            clearInterval(terminalHandle);
            $('#crushit-command').text(''); 
            this.blinking = false;            
        }        
    };
    
    App.initialize();
    myCodeMirror = CodeMirror.fromTextArea(document.getElementById("console"), {
        lineNumbers: true,
        mode: "text/javascript",
        tabMode: "indent",
        matchBrackets: true,
        lineWrapping: true,
        readOnly: true,
        indentUnit: 4
    });
    
    myCodeMirror.setSize('100%', '100%');
});
