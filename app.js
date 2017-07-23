
// Load the http module to create an http server.
var http = require('http'),
    rh = require('./responseHelper'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    currentConnectionsCount = 0,
    status = require('./status.json'),
    statusLookup = require('./statusList.js').statusLookup,
    fs = require('fs'),
    makeMovie = require('./all.js').makeAMovie,
    resizeFilesCount = 0;

    function makeTheMovie() {
      makeMovie().then(
        function(){ console.log('succeeded');},
        function(){ console.log('failed');}
      );
    }

    io.on('connection', function(client) {
      currentConnectionsCount++;
      console.log("CONNECTION STARTED the current connection count is " + currentConnectionsCount);
      let code = statusLookup[status.status];
      io.emit('msg', { msg: currentConnectionsCount, status: status, code: statusLookup['rdy'] });

      client.on('command', function(msg) {
        makeTheMovie();
      });

      client.on('disconnect', function () {
          currentConnectionsCount--;
          console.log("CONNECTION ENDED the current connection count is " + currentConnectionsCount);
      });
    });

    fs.watch('./status.json', { encoding: 'buffer' }, (eventType, filename) => {
      console.log('chhhhange');
      try {
        delete require.cache[require.resolve('./status.json')]
        let sts = require('./status.json');
        let code = statusLookup[sts.status];
        io.emit('msg', { msg: currentConnectionsCount, status: sts, code: code });
      } catch (err) {
        console.log('Partial JSON Read Emit Skipped');
      }
    });

    fs.watch('./raw_photos/temprs', (eventType, filename) => {
      fs.readdir('./raw_photos/temprs', (err, files) => {
        if (files.length !== resizeFilesCount) {
          io.emit('msg', { resizecount: files.length});
          resizeFilesCount = files.length;
          console.log(files.length);
        }
      });
    })


    app.get('/', function (req, res) {
      res.sendFile(__dirname + '/index.html');
    });

    app.use('*', function (request, response) {
      rh.returnFile(response, request.originalUrl);
    });

    server.listen(8080);


    console.log('server listening at http://localhost:8080');
