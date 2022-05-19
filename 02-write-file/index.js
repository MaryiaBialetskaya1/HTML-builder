const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;


const writeableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Привет, напиши мне что-нибудь:\n');
stdin.on('data', data => {
  if(data.toString().trim() !== 'exit'){
    writeableStream.write(data.toString());
  }
  else {
    process.exit();
  }stdout.write('Напиши мне что-нибудь еще:\n'); 
});
process.on('exit', () => {stdout.write('С тобой было очень интересно!!! Увидимся еще!');});process.on('SIGINT', () => {process.exit();
});