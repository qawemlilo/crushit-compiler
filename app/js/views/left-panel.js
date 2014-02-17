
define(['./console'], function (Console) {
    "use strict";
    
    var LeftPanel = Backbone.View.extend({
    
        el: $('#left-panel'),
        
        
        
        active: false,
        
        
        
        showingError: false,
        
        
        terminalHandle: null,
        
        
        
        events: {
            'submit #crushit': 'crushIt',
            'focus #url':  'onUrlFocus',
            'blur #url':  'onUrlBlur',
            'change #max': 'onOptionsChange',
            'change #comments': 'onOptionsChange',
            'change #beautify': 'onOptionsChange'
        },
        
        
        
        initialize: function () {
            this.console = new Console();
            
            this.listenTo(this, 'init', this.init);
            this.listenTo(this, 'loading', this.loading);
            this.listenTo(this, 'loaded', this.loaded);
            this.listenTo(this, 'error', this.onError);

            this.blink();            
        },
        
        
        
        
        crushIt: function (e) {
            e.preventDefault();
            
            // Is CrushIt at work?
            if (this.active) {
                return false;
            }
            
            this.trigger('init');  
            
            var self = this, 
                url = self.$("#url").val(), 
                query = self.$('#crushit').serialize();
            
            self.switchOfBlinker();
            
            self.runTerminal(url, function () {
                self.trigger('loading');
                self.sendRequest('http://crushit-compiler.herokuapp.com/crush', query, 'text', url);
            });
        },
        
        
        
        sendRequest: function (url, data, format, cacheUrl) {
            var self = this;
            
            $.post(url, data, format)
            
            .done(function (code) {
                self.console.update(code);
                self.trigger('loaded');  
            })
            
            .fail(function (xhr) {
                self.trigger('error');
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
            this.$('#submit').addClass('disabled').attr('disabled', 'disabled');
            this.active = true; 
        },
        
        
        
        loaded: function () {
            this.reset();
        },
        
        
        
        
        reset: function () {
            this.$('#submit').removeClass('disabled').attr('disabled', false);        
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
            this.$('#url').val('');
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
                this.$('#comments, #beautify').attr("checked", false);
            }
        },
        
        
        
        runTerminal: function (url, next) {
            var command = this.getCommand(url), 
                terminal = this.$('#crushit-command');
            
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
            var self = this, terminal = this.$('#crushit-command'), on = false;

                
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
            this.$('#crushit-command').text('');          
        }        
    });
    
    return LeftPanel;
})
