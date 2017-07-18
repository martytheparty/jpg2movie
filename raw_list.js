let getFileList = require('./custom_modules/getFileList').getFileList;

let list = getFileList('./raw_photos/flowers').then(
  function(list) {
    for (let i = 0; i < list.length; i++) {
      console.log("'" + list[i] + "',");
    }
  },
  function(err){
    console.log(err);
  }
);
