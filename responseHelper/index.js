var homePage = '',
    fs = require('fs'),
    hpCache = '';

function setHomePage(hpPath) {
  homePage = hpPath;
  fs.readFile(homePage, function (err, content) {
    hpCache = content;
  });
}

function returnHomePage(response) {
  fs.readFile(homePage, function (err, content) {
    hpCache = content;
    response.writeHead(200);
    response.write(hpCache);
    response.end();
  });
}

function returnJSON(response, json) {
  response.setHeader('Content-Type', 'application/json');
  response.writeHead(200);
  response.write(JSON.stringify(json));
  response.end();
}

function returnFile(response, path) {
  if (path.indexOf('/') === 0) {
    /* remove the first slash */
    path = path.substr(1);
  }
  fs.access(path, function (err) {
    if (err) {
      fs.readFile(path, function (err, content) {
        response.writeHead(404);
        response.write('No Resource Found for ' + path);
        response.end();
      });
    } else {
      fs.readFile(path, function (err, content) {
        response.writeHead(200);
        response.write(content);
        response.end();
      });
    }
  });
}

module.exports.setHomePage = setHomePage;
module.exports.returnHomePage = returnHomePage;
module.exports.returnFile = returnFile;
module.exports.returnJsonForJsData = returnJSON;
