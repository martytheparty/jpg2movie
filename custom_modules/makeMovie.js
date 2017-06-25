let videoshow = require('videoshow');

function makeMovie(photos, song, config, movieFileName) {
  console.log("Generate Movie");

  let promise = new Promise(
    function(resolve, reject){


      videoshow(photos, config)
        .audio(song)
        .save(movieFileName)
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

    }
  );

  return promise;

}

exports.makeMovie = makeMovie;

/*
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
*/
