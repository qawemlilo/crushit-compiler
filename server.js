/*
    Dependancies
*/

var cluster = require('cluster'),
    connect = require('connect'),
    crushIt = require('crushit'), 
    http = require('http'), 
    app;
    
    
// Spawn numCPUs worker processes
var numCPUs = require('os').cpus().length,
    clusterStartTime = Date.now(),
    newWorkerEnv = {};


app = connect()
  .use(connect.static('app')) 
  .use(connect.bodyParser())
  .use('/crush', crush);


var port = process.env.PORT || 8080;



function crush (req, res) {
    "use strict";
    
    var url = req.body.url,
        crusher = new crushIt(),    
        beautify  = !!req.body.beautify,
        comments  = !!req.body.comments,
        max  = !!req.body.max,
        mangle = !!req.body.mangle;
        
    if (url[0] === 'w') {
        url = 'http://' + url;
    }
    
    if (!isURL(url)) {
        res.statusCode = 500;
        res.end('Invalid URL :(');
        
        return;
    }
    
    crusher.squeeze({
        website: url,
        beautify: beautify,
        comments: comments,
        max: max,
        mangle: mangle
    },
    function (error, code) {
        if (error) {
            res.statusCode = 500;
            res.end('Crushing script from ' + url + ' failed :(');
        } 
        else {
            res.statusCode = 200;            
            res.end(code); 
        }
    });
}


function isURL(str) {
    "use strict";
    
    var urlReg = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    
    return str.length < 2083 && urlReg.test(str);
}


// Master spawns worker processes
if (cluster.isMaster) {
    newWorkerEnv.clusterStartTime = clusterStartTime;
    
    // Fork workers
    for (var i = 0; i < numCPUs; i++) {
       console.log('Starting worker ' + i);
       cluster.fork(newWorkerEnv);
    }
    
    // If any worker process dies, spawn a new one to bring back number of processes 
    // to be back to numCPUs
    cluster.on('exit', function(worker, code, signal) {
       "use strict";
       
       console.log('worker ' + worker.process.pid + ' died');
       cluster.fork(newWorkerEnv);
    });
    
    // Logs to know what workers are active
    cluster.on('online', function (worker) {
       "use strict";
       
       console.log('Worker ' + worker.process.pid + ' online');
    });

} else {

    if (process.env.clusterStartTime) {
        process.clusterStartTime = new Date(parseInt(process.env.clusterStartTime,10));
    }

    http.createServer(app).listen(port, function() {
        "use strict";
        console.log('Running on port %s', port);
    });    
    
    // Graceful shutdown
    process.on('uncaughtException', function (err) {
        "use strict";
        
        console.error(err.message);
        process.exit();
    });
} // end worker

