import { cli } from './cli.js';

const usernameArg = process.argv.find(arg => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.split('=')[1] : 'Anonymous';

console.log(`Welcome to the File Manager, ${username}!`);

cli(username);

process.on('SIGINFO', () => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});