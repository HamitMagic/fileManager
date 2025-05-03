import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export async function handleHash(args, currentDir) {
  if (!args[0]) {
    console.error('Invalid input');
    return currentDir;
  }

  const filePath = path.resolve(currentDir, args[0]);

  try {
    await new Promise((resolve, reject) => {
      const hash = createHash('sha256');
      const input = fs.createReadStream(filePath);

      input.on('error', reject);

      input.on('data', chunk => hash.update(chunk));

      input.on('end', () => {
        console.log(hash.digest('hex'));
        resolve();
      });
    });
  } catch {
    console.error('Operation failed');
  }

  return currentDir;
}
