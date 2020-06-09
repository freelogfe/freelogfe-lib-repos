import * as spawn from 'cross-spawn';

export default function (cwd: string) {
  return new Promise((resolve, reject) => {
    let command: string = 'npm';
    let args: string[] = [
      'install',
      '--loglevel',
      'error',
    ];

    const child = spawn(command, args, {stdio: 'inherit', cwd});
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
};
