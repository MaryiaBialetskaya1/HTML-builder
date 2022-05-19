const fs = require('fs');
const path = require('path');
fs.readdir(path.join(__dirname, 'styles'), function(err, files) {
  for (let i = 0; i < files.length; i++) {
    if(path.extname(files[i]).trim() === '.css') {      
      fs.stat(path.join(__dirname, `styles/${files[i]}`), function(err, stats) {
        if(stats.isFile()) {          
          const stream = fs.createReadStream(path.join(`${__dirname}/styles`, files[i]));
          let data = '';
          let dataArray = [];
          stream.on('data', chunk => data += chunk);
          stream.on('end', () => {
            dataArray.push(data);
            for (let i = 0; i < dataArray.length; i++) {
              fs.appendFile(
                path.join(`${__dirname}/project-dist`, 'bundle.css'),
                dataArray[i],
                err => {
                  if (err) throw err;
                }
              );
            }
          });
          stream.on('error', error => console.log('Error', error.message));
        }  
      });
    }    
  }
});
