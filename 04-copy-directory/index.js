const fs = require('fs');
const path = require('path');

const original = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

const newDirectory = (original, copyFolder) => {
  fs.mkdir(copyFolder, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
    console.log('Копия папки была создана, можете проверить - она действительно существует!!!');
  });

  fs.readdir(copyFolder, (err, items) => {
    if (err)
      console.log(err);
    else {
      items.forEach(item => {
        fs.access(path.join(original, item), (err) => {
          if (err) {
            fs.rm(path.join(copyFolder, item), { recursive: true, force: true}, (err)   => {
              if (err) throw err;
            });
          }
        });
      });
    }
  });

  fs.readdir(original, {withFileTypes: true}, (err, items) => {
    if (err)
      console.log(err);
    else {
      items.forEach(item => {
        if(item.isFile()){
          fs.copyFile(path.join(original, item.name), path.join(copyFolder, item.name), (err) => {
            if (err) throw err;
          });
        }
        if(item.isDirectory()) {
          newDirectory(path.join(original, item.name), path.join(copyFolder, item.name));
        }
      });
    }
  });
};

newDirectory(original, copyFolder);
