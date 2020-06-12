import * as fs from 'fs-extra';
import * as path from 'path';
import * as inquirer from 'inquirer';
import * as validate from 'validate-npm-package-name';

export default function (src: string) {
  const templates: string[] = fs.readdirSync(path.join(src, 'templates'));

  return inquirer.prompt([
    {
      type: 'list',
      name: 'templateType',
      message: 'select one template:',
      default: templates[0],
      choices: templates,
    },
    {
      name: 'name',
      type: 'string',
      required: true,
      label: 'widget name',
      validate(name) {
        if (!name) {
          return 'Please enter a project name';
        }

        const validateResult: any = validate(name);
        if (!validateResult.validForNewPackages || !validateResult.validForOldPackages) {
          return [
            ...(validateResult.errors || []),
            ...(validateResult.warnings || [])
          ];
        }

        if (fs.existsSync(path.join(process.cwd(), name))) {
          return 'The current folder name already exists';
        }

        return true;
      },
    },
    // {
    //   name: 'enableShadowDom',
    //   type: 'confirm',
    //   required: true,
    //   label: 'enable shadow dom'
    // },
    {
      name: 'description',
      type: 'string',
      required: true,
      label: 'widget description',
      default: 'Freelog App'
    },
    {
      name: 'author',
      type: 'string',
      label: 'Author',
    },
    {
      name: 'license',
      type: 'string',
      label: 'License',
      default: 'MIT'
    }
  ]);
};
