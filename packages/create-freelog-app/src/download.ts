import cli from 'cli-ux';

export default function download(tpl: string, src: string) {
  return new Promise((resolve, reject) => {
    cli.action.start('downloading template');

    const download = require('download-git-repo');

    download(tpl, src, {clone: true}, (err: any) => {
      cli.action.stop();
      if (err) {
        console.error(`Failed to download repo ${tpl}: ` + err.message.trim());
        reject();
      }
      resolve();
    })
  });
}
