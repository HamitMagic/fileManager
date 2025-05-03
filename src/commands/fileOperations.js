import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

export async function handleFileOperations(command, args, currentDir) {
  try {
    switch (command) {
      case 'cat': {
        const filePath = path.resolve(currentDir, args[0]);
        const stream = fs.createReadStream(filePath, 'utf-8');
        stream.pipe(process.stdout);
        await new Promise((resolve, reject) => {
          stream.on('end', resolve);
          stream.on('error', reject);
        });
        break;
      }

      case 'add': {
        const filePath = path.resolve(currentDir, args[0]);
        await fsp.writeFile(filePath, '');
        break;
      }

      case 'mkdir': {
        const dirPath = path.resolve(currentDir, args[0]);
        await fsp.mkdir(dirPath);
        break;
      }

      case 'rn': {
        const oldPath = path.resolve(currentDir, args[0]);
        const newPath = path.resolve(path.dirname(oldPath), args[1]);
        await fsp.rename(oldPath, newPath);
        break;
      }

      case 'cp': {
        const srcPath = path.resolve(currentDir, args[0]);
        const destDir = path.resolve(currentDir, args[1]);
        const destPath = path.join(destDir, path.basename(srcPath));
        await copyFileStream(srcPath, destPath);
        break;
      }

      case 'mv': {
        const srcPath = path.resolve(currentDir, args[0]);
        const destDir = path.resolve(currentDir, args[1]);
        const destPath = path.join(destDir, path.basename(srcPath));
        await copyFileStream(srcPath, destPath);
        await fsp.unlink(srcPath);
        break;
      }

      case 'rm': {
        const filePath = path.resolve(currentDir, args[0]);
        await fsp.unlink(filePath);
        break;
      }

      default:
        console.error('Invalid input');
    }

    return currentDir;
  } catch {
    console.error('Operation failed');
    return currentDir;
  }
}

async function copyFileStream(src, dest) {
  await fsp.access(src); // ensure file exists
  const readStream = fs.createReadStream(src);
  const writeStream = fs.createWriteStream(dest);

  return new Promise((resolve, reject) => {
    readStream.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);
    readStream.pipe(writeStream);
  });
}
