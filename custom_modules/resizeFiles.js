let fs = require('fs');
let fileList = [];
let gm = require('gm');

function resize(path, destination, prevPromise) {
  let fileName = path.split('/').pop();

  if (!prevPromise) {
    prevPromise = new Promise(
      function(resolve, reject) {
        resolve();
      }
    );
  }

  destination = destination + '/' + fileName;
  console.log('registering resize of: ' + fileName);
  // console.log('resize from ' + path + ' to ' + destination);
  let promise = new Promise(
    function(resolve, reject){
      prevPromise.then(
        function() {
          console.log('starting resize of: ' + fileName);
          gm(path).resize('800').noProfile().write(destination, function(err){
            console.log('complete resize of ' + fileName + ' complete.');
            resolve();
          });
        }
      );

      // resolve();
    }
  );
  return promise;
}

function resizeFiles(list, destination) {

  for (let i= 0; i < list.length; i++) {
    if (i > 0) {
      fileList.push(resize(list[i], destination, fileList[i-1]));
    } else {
      fileList.push(resize(list[i], destination));
    }

  }

  let promise = new Promise(
    function(resolve, reject){
      Promise.all(fileList).then(
        function() {
          console.log('ALL PROMISES RESOLVED');
          resolve();
        }
      );
    }
  );

  return promise;

}

exports.resizeFiles = resizeFiles;

/*

1. Get List Of Files From The Source Path.
2. Get Save Resized Version To The Destination Path

function resize() {
  console.log('     4. resizing ' + file);
  let promise = new Promise(
    function(resolve, reject) {
      gm(src).resize('800').noProfile().write(rsizeDest, function(err){
        listOfResizedFiles.push(rsizeDest);
          resolve();
      });
    }
  );

  return promise;
}

*/
