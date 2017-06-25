let allDone = require('./custom_modules/allDone').allDone;
let chainError = require('./custom_modules/chainError').chainError;
let deleteFilesInDirectory = require('./custom_modules/deleteFilesInDirectory').deleteFiles;
let getFileList = require('./custom_modules/getFileList').getFileList;
let makeMovie = require('./custom_modules/makeMovie').makeMovie;


let videoshow = require('videoshow');
let srcPath = './raw_photos/temprs';
let songPath = './mp3s/insanity.mp3';
let sourceFiles = [];
let videoOptions = require('./config/movie.js').videoOptions;

function getFiles() {
  let promise = new Promise(
    function(resolve, reject){
      console.log('***** get files *****');
      getFileList(srcPath).then(
        function(list) {
          sourceFiles = list;
          resolve();
        }
      );
    }
  );
  return promise;
}

function generateMovie() {
  let promise = new Promise(
    function(resolve, reject){
      makeMovie(sourceFiles, songPath, videoOptions).then(
        function(){
          resolve();
        }
      );
    }
  );
  return promise;
}

getFiles()
.then(generateMovie, chainError)
.then(allDone, chainError);
