let chainError = require('./custom_modules/chainError').chainError;
let getFileList = require('./custom_modules/getFileList').getFileList;
let resizeFiles = require('./custom_modules/resizeFiles').resizeFiles;
let srcPath = './raw_photos/tempfs';
let destPath = './raw_photos/temprs';
let srcFiles = [];

function getSourceFiles() {
  let promise = new Promise(
    function(resolve, reject){
      getFileList(srcPath).then(
        function(list){
          srcFiles = list;
          resolve();
        }
      );
    }
  );
  return promise;
}

function resizeSourceFiles() {
  resizeFiles(srcFiles, destPath);
}

getSourceFiles()
.then(resizeSourceFiles, chainError);
