let gm = require('gm');

gm('./dog.jpg')
.resize(240)
.noProfile()
.write('./rs_dog.jpg', function (err) {
  if (!err) console.log('done');
});
