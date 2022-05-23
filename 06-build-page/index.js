const fs = require('fs');
const promises = fs.promises;
const path = require('path');

const createNewFolder = path.join(__dirname, 'project-dist');
const createNewAssets = path.join(createNewFolder, 'assets');
const createNewCss = path.join(createNewFolder, 'style.css');
const createNewHtml = path.join(createNewFolder, 'index.html');


const components = path.join(__dirname, 'components');
const assets = path.join(__dirname, 'assets');
const css = path.join(__dirname, 'styles');
const htmlTemplate = path.join(__dirname, 'template.html');



async function createFolder(inputPath) {
  fs.access(createNewFolder, (error) => {
    if (error) {
      promises.mkdir(inputPath);
    }
  });
}

async function createNewFile(inputPath, content) {
  return await promises.writeFile(inputPath, content);
}


async function mergeStyles() {
  let stylesArray = [];
  const styleFiles = await promises.readdir(css, { withFileTypes: true });

  for (let file of styleFiles) {
    const currentPath = path.join(css, file.name);
    const fileType = path.extname(currentPath);

    if (fileType === '.css') {
      const content = await promises.readFile(currentPath, 'utf8');
      stylesArray.push(`${content}\n\n`);
    }
  }

  createNewFile(createNewCss, stylesArray);
}


async function copyDirectory(fromPath, toPath) {
  await promises.rm(toPath, { force: true, recursive: true });
  await promises.mkdir(toPath, { recursive: true });

  const filesName = await promises.readdir(fromPath, { withFileTypes: true });

  for (let file of filesName) {
    const currentPath = path.join(fromPath, file.name);
    const copyPath = path.join(toPath, file.name);

    if (file.isDirectory()) {
      await promises.mkdir(copyPath, { recursive: true });
      await copyDirectory(currentPath, copyPath);

    } else if (file.isFile()) {
      await promises.copyFile(currentPath, copyPath);
    }
  }
}

async function pasteComponents() {
  let html = await promises.readFile(htmlTemplate, 'utf-8');
  const filesArray = await promises.readdir(components, { withFileTypes: true });

  for (let file of filesArray) {
    const contentOfComponents = await promises.readFile(path.join(components, `${file.name}`), 'utf-8');
    const expression = new RegExp(`{{${(file.name).split('.')[0]}}}`, 'g');
    html = html.replace(expression, contentOfComponents);
  }

  createNewFile(createNewHtml, html);
}

async function creatDistFolder() {
  createFolder(createNewFolder);
  mergeStyles();
  copyDirectory(assets, createNewAssets);
  pasteComponents();
}

creatDistFolder();

