let fs = require('fs');

function getFileList(path) {
  let files;
  let promise = new Promise(
    function(resolve, reject){
      fs.readdir(path, function (err, data) {
        if(err) {
          reject(err);
          console.log(err);
        } else {
          for (let i = 0; i < data.length; i++) {
            data[i] = path + '/' + data[i];
          }
          resolve(data);
        }
      })
    }
  );
  return promise;
}

exports.getFileList = getFileList;
