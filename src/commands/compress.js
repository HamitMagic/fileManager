import fs from 'node:fs';
import path from 'node:path';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

export async function handleCompress(command, args, currentDir) {
  if (!args[0] || !args[1]) {
    console.error('Invalid input');
    return currentDir;
  }

  const srcPath = path.resolve(currentDir, args[0]);
  const destDir = path.resolve(currentDir, args[1]);
  console.log(destDir)
  const fileName = path.basename(srcPath);
  const destPath = path.join(destDir, command === 'compress' ? `${fileName}.br` : fileName.replace(/\.br$/, ''));

  try {
    await new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(srcPath);
      const writeStream = fs.createWriteStream(destPath);
      const transformStream =
        command === 'compress'
          ? createBrotliCompress()
          : createBrotliDecompress();

      readStream.pipe(transformStream)
        .on('error', reject)
        .pipe(writeStream)
        .on('error', reject)
        .on('finish', resolve);
    });
  } catch {
    console.error('Operation failed');
  }

  return currentDir;
}
