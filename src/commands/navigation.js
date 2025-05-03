import fs from 'node:fs/promises';
import path from 'node:path';

const isRoot = (p) => {
  const root = path.parse(p).root;
  return path.resolve(p) === root;
};

export async function handleNavigation(command, args, currentDir) {
  try {
    switch (command) {
      case 'up':
        if (isRoot(currentDir)) return currentDir;
        return path.dirname(currentDir);

      case 'cd':
        if (!args[0]) throw new Error('No path provided');
        const newPath = path.resolve(currentDir, args[0]);
        const stat = await fs.stat(newPath);
        if (!stat.isDirectory()) throw new Error('Not a directory');
        return newPath;

      case 'ls':
        const files = await fs.readdir(currentDir, { withFileTypes: true });

        const directories = [];
        const regularFiles = [];

        for (const item of files) {
          if (item.isDirectory()) {
            directories.push({ Name: item.name, Type: 'directory' });
          } else {
            regularFiles.push({ Name: item.name, Type: 'file' });
          }
        }

        const sorted = [...directories, ...regularFiles].sort((a, b) =>
          a.Name.localeCompare(b.Name)
        );

        console.table(sorted);
        return currentDir;

      default:
        console.error('Invalid input');
        return currentDir;
    }
  } catch {
    console.error('Operation failed');
    return currentDir;
  }
}
