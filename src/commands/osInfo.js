
import os from 'node:os';

export async function handleOSInfo(args) {
  const option = args[0];

  switch (option) {
    case '--EOL':
      console.log(JSON.stringify(os.EOL));
      break;

    case '--cpus': {
      const cpus = os.cpus();
      console.log(`Total CPUs: ${cpus.length}`);
      const data = cpus.map((cpu, i) => ({
        CPU: `#${i + 1}`,
        Model: cpu.model,
        Speed_GHz: (cpu.speed / 1000).toFixed(2)
      }));
      console.table(data);
      break;
    }

    case '--homedir':
      console.log(os.homedir());
      break;

    case '--username':
      console.log(os.userInfo().username);
      break;

    case '--architecture':
      console.log(process.arch);
      break;

    default:
      console.error('Invalid input');
  }

  return;
}
