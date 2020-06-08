import * as fs from 'fs-extra';
import * as path from 'path';
import * as inquirer from 'inquirer';

export default async function (src: string) {
  const templates: string[] = fs.readdirSync(path.join(src, 'templates'));

  const answers: any = await inquirer.prompt([
    {
      type: 'list',
      name: 'templateType',
      message: 'select one template:',
      default: templates[0],
      choices: templates,
    },
    {
      name: 'name',
      type: "string",
      required: true,
      label: "widget name",
      validate(name) {
        const NAME_REG = /^freelog-[a-z0-9._-]{4,15}-[a-z0-9._-]{4,64}$/
        if (NAME_REG.test(name)) {
          return true;
        } else {
          return '不符合widget命名规则，规则：/^freelog-[a-z0-9._-]{4,15}-[a-z0-9._-]{4,64}$/'
        }
      },
    },
    {
      name: 'enableShadowDom',
      type: "confirm",
      required: true,
      label: "enable shadow dom"
    },
    {
      name: 'description',
      type: "string",
      required: true,
      label: "widget description",
      default: "A freelog widget"
    },
    {
      name: 'author',
      type: "string",
      label: "Author",
    },
    {
      name: 'license',
      type: "string",
      label: "License",
      default: "MIT"
    }
  ]);
  return answers;
};
