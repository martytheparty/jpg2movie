let chainError = require('./custom_modules/chainError').chainError;
let getFileList = require('./custom_modules/getFileList').getFileList;
let deleteFilesInDirectory = require('./custom_modules/deleteFilesInDirectory').deleteFiles;
let copyFiles = require('./custom_modules/copyFiles').copyFiles;
let srcFileList =[];
let destFileList =[];
let srcPath = './raw_photos/temp';
let destPath= './raw_photos/tempfs'

function deleteDestFiles(){
  console.log('*********');
  let promise = new Promise(
    function(resolve, reject) {
      deleteFilesInDirectory(destFileList).then(
        function(){
          resolve();
        }
      );
    },
    function(err) {
      console.log(err);
    }
  );
  return promise;
}

function getSrcFiles(){
  let promise = new Promise(
    function(resolve, reject) {
      getFileList(srcPath).then(
        function(list){
          srcFileList = list;
          resolve();
        }
      );
    }
  );
  return promise;
}

function getDestFiles(){
  let promise = new Promise(
    function(resolve, reject) {
      getFileList(destPath).then(
        function(list){
          destFileList = list;
          resolve();
        }
      );
    }
  );
  return promise;
}

function copyFileList(){
  copyFiles(srcFileList, destPath).then(
    function () {
      console.log('copy complete');
    },
    chainError
  );
}

getDestFiles()
.then(deleteDestFiles, chainError)
.then(getSrcFiles, chainError)
.then(copyFileList, chainError);
