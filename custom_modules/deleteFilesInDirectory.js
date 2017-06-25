/* this file is misnamed - it deletes a list of files. */

let fs = require('fs');

function deleteFile(file) {
  let promise = new Promise(
    function(resolve, reject){
      console.log('deleting file: ' + file);

      fs.unlink(file, function() {
        resolve();
      }, function(err) {
        console.log(err);
      });

    },
    function(err) {
      console.log(err);
    }
  );
  return promise;
}

function deleteFiles(list) {
  let promises = [];

  for (let i = 0; i < list.length; i++) {
    promises.push(deleteFile(list[i]));
  }

  let promise = new Promise(
    function(resolve, reject){
      Promise.all(promises).then(
        function(){
          resolve();
        },
        function(err){
          console.log(err);
          resolve();
        }
      );
    }
  );
  return promise;
}

exports.deleteFiles = deleteFiles;
