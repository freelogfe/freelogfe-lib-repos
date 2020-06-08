import {exec} from 'child_process';

export default function (cwd: string) {
  return new Promise((resolve, reject) => {
    exec('npm install',
      {cwd},
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
          return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        resolve();
      }
    );
  });
};
