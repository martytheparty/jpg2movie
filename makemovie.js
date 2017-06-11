let fs = require('fs');
let fse = require('fs-extra');
let Promise = require('promise');
let gm = require('gm');
let videoshow = require('videoshow');

let videoOptions = require('./config/movie.js').videoOptions;
let ensureTempDirectoryExists = require('./custom_modules/ensureTempDirectoryExists').ensureTempDirectoryExists;
let allDone = require('./custom_modules/allDone').allDone;
let getFileList = require('./custom_modules/getFileList').getFileList;
let chainError = require('./custom_modules/chainError').chainError;

console.log("*******************************************************");
console.log("*************  MOVIE LOADING SCRIPT       *************");
console.log("*******************************************************");

/*

This script assumes that the following has been done:
sudo apt-get install imagemagick
sudo apt-get install graphicsmagick

*/


function beginProcessing(){
  let listOfFiles = [];
  let listOfResizedFiles = [];
  let listOfCopyPromises = [];
  let listOfResizePromises = [];

  function setFileList() {
  console.log(' *********** start setFileList  **********');
    //console.log('creating file list: ');
    let promise = new Promise(
      function(resolve, reject){
        getFileList('raw_photos/raw').then(
          function (files){
            listOfFiles = files;
            resolve();
          }
        );
      }
    );
    return promise;
  }

  function copyFiles() {
  console.log(' *********** start copyFiles  **********');
    function srcDestEqual(src, dest) {
      var isEqual = false;
      var srcData = fs.statSync(src).size;
      var destData = fs.statSync(dest).size;
      if (srcData === destData) {
        isEqual = true;
      }
      return isEqual;
    }

    function copyFile(file) {
      let promise = new Promise(
        function(resolve, reject){
          let source = 'raw_photos/raw/'+file;
          let dest = 'raw_photos/temp/'+file;
          //console.log('* from ' + source);
          //console.log('* to ' + dest);
          fs.readFile(source, function(err, data) {
            fs.writeFile(dest, data, function (err) {
              if (srcDestEqual(source, dest)){
                fs.stat (dest,
                  function(err, stats) {
                    resolve();
                  }
                );
              }
            })
          });

        }
      );

      listOfCopyPromises.push(promise);
    };


    let promiseList = [];
    listOfFiles.map(copyFile);

    let promise = new Promise(
      function(resolve, reject) {
        Promise.all(listOfCopyPromises).then(
          function() {
            resolve();
            console.log(' *********** end copyFiles     **********');
          }
        );
      }
    );
    console.log('     returned the promise');
    return promise;

  }

  function resizeFiles() {
    console.log(' *********** resizeFiles  **********');
    let filesProcessed = 0;

    function resizeFile() {

      let file = listOfFiles[filesProcessed];

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


      console.log('     ******** RESIZE FILE PROMISE ' + file + ' ***************');
      let src = 'raw_photos/temp/'+file;
      let dest = 'raw_photos/temp/'+filesProcessed+'.jpg';
      let rsizeDest = 'raw_photos/temp/rs_'+file;
      filesProcessed++;

      let resizePromise = new Promise(
        function(resolve, reject) {
          console.log('     1. adding resize promise ' + filesProcessed + ' - ' + listOfFiles.length + ' - ' + file);
          try {
            //listOfResizePromises.push(resizePromise);
          } catch(e) {
            console.log(e);
          }

          console.log('     2. added resize promise ' + filesProcessed + ' - ' + listOfFiles.length + ' - ' + file);
          if (filesProcessed < listOfFiles.length) {
            console.log('     3. add another file to be resized ');
            listOfResizePromises.push(resize());
            resizeFile();

          } else {
            console.log('     3. add last file to be resized ');
            listOfResizePromises.push(resize());

          }
        },
        function() {
          reject();
        }
      );

      return resizePromise;
    }

    resizeFile();

    let allResizedPromise = new Promise(
      function(resolve, reject) {

        Promise.all(listOfResizePromises).then(
          function () {
            resolve();
            console.log('     5. end resizeFiles');
          }
        );

      }
    );
    console.log('     ****** WAITING ON RESIZES TO COMPLETE ******');
    return allResizedPromise;
  }


  function makeMovieFromPictures() {
    console.log(' *********** start makeMoveFromPictures  **********');

    let resizePromise = new Promise(
      function (resolve, reject) {

        videoshow(listOfResizedFiles, videoOptions)
          .audio('mp3s/hs_rejects.mp3')
          .save('video-rocking.mp4')
          .on('start', function (command) {
            // console.log('ffmpeg process started:', command);
            console.log('ffmpeg process started.');
          })
          .on('error', function (err, stdout, stderr) {
            console.error('Error:', err)
            reject();
            console.error('ffmpeg stderr:', stderr)
          })
          .on('end', function (output) {
            resolve();
            console.log('Video created in:', output)
          })

        //console.log(listOfResizedFiles);

      }
    );

    return resizePromise;
    console.log(' *********** end makeMoveFromPictures  **********');
  }



  ensureTempDirectoryExists()
    .then(setFileList, chainError)
    .then(copyFiles, chainError)
    .then(resizeFiles, chainError)
    .then(makeMovieFromPictures, chainError)
    .then(allDone, chainError);
}

console.log("*******************************************************");
console.log("*************  MOVIE SCRIPT LOADED        *************");
console.log("*******************************************************");

beginProcessing();
