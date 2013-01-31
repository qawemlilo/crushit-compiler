var connect = require('connect'),
    crushit = require('crushit'), 
    http = require('http'), 
    app;

app = connect()
  .use(connect.static('app'))
  .use(connect.bodyParser())
  .use('/build', connect.static('build/'));
  .use('/crush', crush);

http.createServer(app).listen(8080, function() {
  console.log('Running on http://localhost:8080');
});



function crush(req, res) {
    var url = req.body.url, beautify  = !!req.body.beautify;
    
    crushit.crushScripts(url, {
        beautify: beautify,
        
        onComplete: function (code) {
            res.end(code);
        }
    });
}