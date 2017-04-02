const fs = require('fs');
const sharp = require('sharp');
const shortid = require('shortid');

const foldersWithFiles = {};
const folderList = fs.readdirSync('images');

function resizeWithSharp(fullPath, filename, width, height, saveFolder) {
  let sharpResize = sharp(fullPath)
      .resize(width, height)
      .max()
      .withoutEnlargement()
      .jpeg({ quality: 90 });

  sharpResize = sharpResize.toFile(saveFolder + filename);

  return sharpResize;
}

const sharpJobs = [];

function dealWithFile(filePath) {
  const filename = shortid.generate() + '.jpg';

  // generate big image
  sharpJobs.push(resizeWithSharp(filePath, filename, null, 2500, 'public/img/l/'));

  // generate medium image
  sharpJobs.push(resizeWithSharp(filePath, filename, null, 1500, 'public/img/m/'));

  // generate thumbnail image
  sharpJobs.push(resizeWithSharp(filePath, filename, 300, 300, 'public/img/s/'));

  return filename;
}

folderList.forEach((folder) => {
  foldersWithFiles[folder] = {
    title: '',
    date: '',
    files: fs.readdirSync('images/' + folder),
  };
});

Object.keys(foldersWithFiles).forEach((folder) => {
  foldersWithFiles[folder].files.forEach((file, i) => {
    foldersWithFiles[folder].files[i] = dealWithFile('images/' + folder + '/' + file);
  });
});

Promise.all(sharpJobs)
  .then(() => {
    console.log('Done');
    fs.writeFileSync('data.json', JSON.stringify(foldersWithFiles, undefined, 2));
  });
