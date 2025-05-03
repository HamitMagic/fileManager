import readline from 'node:readline';
import os from 'node:os';
import { handleCommand } from './commands/main.js';

let directory = os.homedir();

function printCWD() {
  console.log(`You are currently in ${directory}`);
}

export function cli(username) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  printCWD();
  rl.prompt();

  rl.on('line', async (line) => {
    const trimmed = line.trim();

    if (trimmed === '.exit') {
      rl.close();
    } else {
      try {
        directory = await handleCommand(trimmed, directory);
      } catch (err) {
        console.error('Operation failed');
      }
      printCWD();
      rl.prompt();
    }
  });

  rl.on('close', () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit();
  });
}