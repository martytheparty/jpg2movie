
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
    fs = require('fs');



    io.on('connection', function(client) {
      currentConnectionsCount++;
      console.log("CONNECTION STARTED the current connection count is " + currentConnectionsCount);
      let code = statusLookup[status.status];
      io.emit('msg', { msg: currentConnectionsCount, status: status, code: statusLookup['rdy'] });

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
        console.log(sts);
      } catch (err) {
        console.log('Partial JSON Read Emit Skipped');
      }

    });


    app.get('/', function (req, res) {
      res.sendFile(__dirname + '/index.html');
    });

    app.use('*', function (request, response) {
      rh.returnFile(response, request.originalUrl);
    });

    server.listen(8080);

    console.log('server listening at http://localhost:8080');
