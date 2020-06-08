import * as fs from 'fs-extra';
import * as path from 'path';
import * as inquirer from 'inquirer';

export default async function (src: string) {
  const templates: string[] = fs.readdirSync(path.join(src, 'templates'));
  const answer: any = await inquirer.prompt([{
    type: 'list',
    name: 'templateType',
    message: 'select one template:',
    'default': templates[0],
    choices: templates,
  }]);
  return answer.templateType;
};
