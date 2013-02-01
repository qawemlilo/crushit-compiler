
/*
    Dependancies
*/

var connect = require('connect'),
    crushit = require('crushit'), 
    http = require('http'), 
    app;


app = connect()
  .use(connect.static('app'))
  .use(connect.bodyParser())
  .use('/build', connect.static('build/'))
  .use('/crush', crush);

http.createServer(app).listen(8080, function() {
  console.log('Running on http://localhost:8080');
});



function crush (req, res) {
    var url = req.body.url, 
        beautify  = !!req.body.beautify,
        comments  = !!req.body.comments,
        strict  = !!req.body.strict;
    
    crushit.crushScripts(url, {
        beautify: beautify,
        
        comments: comments,
        
        strict: strict,
        
        onComplete: function (error, code) {
            if (error) {
                res.end(error.msg);
            } 
            else { 
                res.end(code); 
            }
        }
    });
}