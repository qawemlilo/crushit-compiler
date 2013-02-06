/*
    Dependancies
*/

var connect = require('connect'),
    crushit = require('crushit'), 
    http = require('http'), 
    app;


app = connect()
  .use(connect.static('production')) // uncomment when deploying
  .use(connect.bodyParser())
  .use('/crush', crush);


var port = process.env.PORT || 8080;

http.createServer(app).listen(port, function() {
  console.log('Running on port %s', port);
});



function crush (req, res) {
    var url = req.body.url, 
        beautify  = !!req.body.beautify,
        comments  = !!req.body.comments,
        max  = !!req.body.max;
    
    crushit.crushScripts(url, {
        beautify: beautify,
        
        comments: comments,
        
        max: max,
        
        onComplete: function (error, code) {
            if (error) {
                console.log(error.msg);
                res.end(error.msg);
            } 
            else { 
                res.end(code); 
            }
        }
    });
}
