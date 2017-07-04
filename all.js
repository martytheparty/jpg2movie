let chainError = require('./custom_modules/chainError').chainError;
let getFileList = require('./custom_modules/getFileList').getFileList;
let deleteFiles = require('./custom_modules/deleteFilesInDirectory').deleteFiles;
let resizeFiles = require('./custom_modules/resizeFiles').resizeFiles;
let makeMovie = require('./custom_modules/makeMovie').makeMovie;
let allDone = require('./custom_modules/allDone').allDone;

let videoshow = require('videoshow');
let songPath = require('./config/movie.js').mp3Path;
let movieFileName = 'all-movie.mp4'
let videoOptions = require('./config/movie.js').videoOptions;

let originalPath = './raw_photos/tempfs';
let resizePath = './raw_photos/temprs';

let sourceFiles = require('./config/movie.js').sourceFiles;
let movieFiles = [];
let filesToDelete = [];

/*

1. Get a list of files in the resize directories
2. Delete files in resize path.
3. Get list of files in original path.
4. Resize files in orinal path to resize page.
5. Make the movie.

*/

function getListOfFilesToDelete() {
  console.log('Get List Of Files To Delete');
  let promise = new Promise(
    function(resolve, reject) {
      getFileList(resizePath).then(
        function(list){
          filesToDelete = list;
          console.log(list.length + " files retrieved for deletion.");
          resolve();
        }
      );
    }
  );
  return promise;
}

function deletePreviouslyResizedFiles() {
  console.log('Deleting ' + filesToDelete.length + ' files.');
  let promise = new Promise(
    function(resolve, reject) {
      deleteFiles(filesToDelete).then(
        function(){
          console.log('Deleted ' + filesToDelete.length + ' files.');
          resolve();
        }
      );
    }
  );
}

function getListOfFilesToResize() {
  console.log('Getting list of files to resize.');
  let promise = new Promise(
    function(resolve, reject) {
      console.log(sourceFiles.length + " files retrieved for resizing.");
      // sourceFiles = require('./config/movie.js').sourceFiles;
      /* The source files have been retrieved from the config file. */
      resolve();
      // getFileList(originalPath).then(
      //   function(list){
      //     sourceFiles = list;
      //     console.log(sourceFiles.length + " files retrieved for resizing.");
      //     resolve();
      //   }
      // );
    }
  );
  return promise;
}

function resizeSourceFiles() {
  console.log('Resize files... this usually takes a while.');
  let promise = new Promise(
    function(resolve, reject) {
      resizeFiles(sourceFiles, resizePath).then(
        function() {
          console.log('Resizing complete');
          resolve();
        }
      );
    }
  );
  return promise;
}

function getListOfFilesForMovie() {
  console.log('Get list of movie files.');
  let promise = new Promise(
    function(resolve, reject) {
      for(let i = 0; i < sourceFiles.length; i++){
        let src = sourceFiles[i].split('/').pop()
        console.log(resizePath + '/' + src);
        movieFiles.push(resizePath + '/' + src);
      }
      resolve();
    }
  );
  return promise;
}

 function makeMovieFromResized() {
   console.log('Make movies... this usually takes a while too...');
   let promise = new Promise(
     function(resolve, reject) {
       makeMovie(movieFiles, songPath, videoOptions, movieFileName).then(
         function() {
           console.log('Movie complete.');
           resolve();
         }
       );
     }
   );
   return promise;
 }

getListOfFilesToDelete()
.then(deletePreviouslyResizedFiles, chainError)
.then(resizeSourceFiles, chainError)
.then(getListOfFilesForMovie, chainError)
.then(makeMovieFromResized, chainError)
.then(allDone, chainError);
