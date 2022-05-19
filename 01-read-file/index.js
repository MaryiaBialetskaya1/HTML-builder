const fs = require('fs');
const path = require('path');
const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
let data = '';
readStream.on('data', function(chunk) {data += chunk;
}).on('end', function() {console.log(data);
});