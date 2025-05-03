import { handleNavigation } from './navigation.js';
import { handleFileOperations } from './fileOperations.js';
import { handleOSInfo } from './osInfo.js';
import { handleHash } from './hash.js';
import { handleCompress } from './compress.js';

export async function handleCommand(input, currentDir) {
  const [command, ...args] = input.split(' ');

  if (['up', 'cd', 'ls'].includes(command)) {
    return await handleNavigation(command, args, currentDir);
  }

  if (['cat', 'add', 'rn', 'cp', 'mv', 'rm', 'mkdir'].includes(command)) {
    return await handleFileOperations(command, args, currentDir);
  }

  if (command === 'os') {
    return await handleOSInfo(args, currentDir);
  }

  if (command === 'hash') {
    return await handleHash(args, currentDir);
  }

  if (['compress', 'decompress'].includes(command)) {
    return await handleCompress(command, args, currentDir);
  }

  console.error('Invalid input');
  return currentDir;
}