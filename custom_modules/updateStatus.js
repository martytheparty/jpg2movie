let fs = require('fs');

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

function writeStatus(status) {
  let currentDateTime = getDateTime();
  let data = {};
  data.dateTime = currentDateTime;
  data.status = status;
  let dataString = JSON.stringify(data);

  let promise = new Promise(
    function(resolve, reject){
      let options = { flag : 'w+' };
      fs.writeFile("./status.json", dataString, options, function(err){
        console.log('wrote ' + status);
        resolve();
      });
    }
  );
  return promise;


}

exports.writeStatus = writeStatus;
