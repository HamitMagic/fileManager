import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import path from 'node:path';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

export async function handleCompress(command, args, currentDir) {
  if (!args[0]) {
    console.error('Invalid input');
    return currentDir;
  }

  const srcPath = path.resolve(currentDir, args[0]);
  const destDir = path.resolve(currentDir, args[1]);
  const stat = await fsPromise.stat(destDir);
  if (!stat.isDirectory()) {
    console.log('Wrong Directory');
    return currentDir;
  }
  const fileName = path.basename(srcPath);
  const destPath = path.join(destDir, command === 'compress' ? `${fileName}.br` : fileName.replace(/\.br$/, ''));

  try {
    await new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(srcPath);
      const writeStream = fs.createWriteStream(destPath);
      const transformStream = command === 'compress' ? createBrotliCompress() : createBrotliDecompress();

      readStream.pipe(transformStream)
        .pipe(writeStream)
        .on('error', reject)
        .on('finish', resolve);
    });
  } catch {
    console.error('Operation failed');
  }

  return currentDir;
}
