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
  .use('/crush', crush);


var port = process.env.PORT || 8080;

http.createServer(app).listen(port, function() {
  console.log('Running on port %s', port);
});



function crush (req, res) {
    var url = req.body.url, 
        beautify  = !!req.body.beautify,
        comments  = !!req.body.comments,
        max  = !!req.body.max,
        mangle = !!req.body.mangle;
        
    if (url[0] === 'w') {
        url = 'http://' + url;
    }
    
    crushit.squeeze({
        website: url,
        beautify: beautify,
        comments: comments,
        max: max,
        mangle: mangle
    },
    function (error, code) {
        if (error) {
            res.statusCode = 500;
            res.end(error);
        } 
        else {
            res.statusCode = 200;            
            res.end(code); 
        }
    });
}
