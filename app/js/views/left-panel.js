
define(['../libs/md5', './console'], function (md5, Console) {
    "use strict";
    
    var LeftPanel = Backbone.View.extend({
    
        el: $('#left-panel'),
        
        
        
        active: false,
        
        
        
        showingError: false,
        
        
        terminalHandle: null,
        
        
        
        cache: {},
        
        
        
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
            
            this.listenTo(this, 'loading', this.loading);
            this.listenTo(this, 'loaded', this.loaded);
            this.listenTo(this, 'error', this.onError);

            this.blink();            
        },
        
        
        
        
        crushIt: function () {
            // Is CrushIt at work?
            if (this.active) {
                return;
            }
            
            var self = this, url = self.$("#url").val();
            
            clearInterval(self.terminalHandle);
            
            self.runTerminal(url, function () {
                self.trigger('loading');
                self.sendRequest('/crush', self.$('#crushit').serialize(), 'text', url);
            });
            
            return false;
        },
        
        
        
        sendRequest: function (url, data, format, cacheUrl) {
            var cacheKey = 'ct' + md5(cacheUrl), self = this;
            
            if (self.cache.hasOwnProperty(cacheKey) && _.isEqual(data, self.cache[cacheKey].request)) {
                self.console.update(self.cache[cacheKey].code);
                self.trigger('loaded');

                return false;
            }
            
            $.post(url, data, format)
            
            .done(function (code) {
                self.console.update(code);
                self.cache[cacheKey] = {
                    url: cacheUrl,
                    request: data,
                    code: code
                };
                
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
            this.$('#submit').addClass('disabled').attr('disabled', 'disabled');
            $('#loading').removeClass('loading-inactive').addClass('loading-active');
            this.active = true;
        },
        
        
        
        
        loaded: function () {
            this.reset();
        },
        
        
        
        
        reset: function () {
            this.active = false;
            this.$('#submit').removeClass('disabled').attr('disabled', false);        
            $('#loading').removeClass('loading-active').addClass('loading-inactive');            
        },
        
        
        
        onError: function () {
            $('#console').addClass('error');
            this.showingError = true;
            
            this.reset();
            
        },
        


        onUrlFocus: function () {
            this.$('#url').val('');
            this.console.update('');
            
            this.$('#crushit-command').empty();
            clearInterval(this.terminalHandle);
        },
        
        
        
 
        onUrlBlur: function () {
            this.blink();
        },
        
        
        
        
        onOptionsChange: function () {
            if ($('#max').is(':checked')) {
                this.$('#comments, #beautify').attr("checked", false);
            }
        },
        
        
        
        runTerminal: function (url, next) {
            var command = this.getCommand(url), terminal = this.$('#crushit-command');
            
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

                
            self.terminalHandle = setInterval(function(){
                if(on) { 
                    terminal.html('');
                    on = false;
                }
                else {
                    terminal.html('_');
                    on = true;
                }  
            }, 500);
        }         
    });
    
    return LeftPanel;
})