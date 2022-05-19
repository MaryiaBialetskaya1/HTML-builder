const path = require('path');
const fs = require('fs/promises');
const { stat } = require('fs');

const directory = path.join(__dirname, 'secret-folder');

fs.readdir(directory, {withFileTypes: true})
  .then(e => {
    for (const item of e) {
      if (item.isFile()) {
        const ext = path.join(directory, item.name);
        const object = path.parse(ext);

        stat(ext, (err, stats) => {
          let size = stats.size / 1024;
          console.log(`\n${object.name} - ${object.ext.slice(1)} - ${size}kb\n`);
        
        });
      }
    }
  });      