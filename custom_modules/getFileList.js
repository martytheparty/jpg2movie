let fs = require('fs');

function getFileList(path) {
  console.log('Get The Files From ' + path);
  let files;
  let promise = new Promise(
    function(resolve, reject){
      fs.readdir('raw_photos/raw', function (err, data) {
        resolve(data);
      })
    }
  );
  return promise;
}

exports.getFileList = getFileList;
