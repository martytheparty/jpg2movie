let fs = require('fs');

function ensureTempDirectoryExists() {
  console.log(' *********** start ensureTempDirectoryExists **********');
  let promise = new Promise(
    function(resolve, reject){
      fs.stat('./raw_photos/temp', function(err, data){
        if(err){
          fs.mkdir('./raw_photos/temp', function (err, data) {
            console.log('No Temp Directory \nCreating a temp directory.');
            resolve();
            console.log(' *********** end ensureTempDirectoryExists (created) **');
          });
        } else {
          resolve();
            console.log(' *********** end ensureTempDirectoryExists (created) **');
        }
      });
    }
  );
  return promise;
}

exports.ensureTempDirectoryExists = ensureTempDirectoryExists;
