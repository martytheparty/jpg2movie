let fs = require('fs');

function copyFile(filePath, destination) {
  let promise = new Promise(
    function(resolve, reject){
      let fileName = filePath.split('/').pop();

      fs.readFile(filePath, function(err, data) {
        fs.writeFile(destination + '/' + fileName, data, function (err) {
          resolve();
        })
      });
    }
  );
  return promise;
}

function copyListOfFiles (list, destination) {
  let listOfCopyPromises = [];

  for (let i = 0; i < list.length; i++) {
    listOfCopyPromises.push(copyFile(list[i], destination));
  }

  let promise = new Promise(
    function(resolve, reject){
      Promise.all(listOfCopyPromises).then(
        function() {
          resolve();
        }
      );
    }
  );
  return promise;
}

function copyFiles(list, destination) {
  let promise = new Promise(
    function(resolve, reject){
      copyListOfFiles(list, destination).then(
        function(){
          resolve();
        }
      );
    }
  );
  return promise;
}

exports.copyFiles = copyFiles;
