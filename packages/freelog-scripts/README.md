@freelog/freelog-scripts
========================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@freelog/freelog-scripts.svg)](https://npmjs.org/package/@freelog/freelog-scripts)
[![Downloads/week](https://img.shields.io/npm/dw/@freelog/freelog-scripts.svg)](https://npmjs.org/package/@freelog/freelog-scripts)
[![License](https://img.shields.io/npm/l/@freelog/freelog-scripts.svg)](https://github.com/liu-kai-github/freelog-scripts/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @freelog/freelog-scripts
$ freelog-scripts COMMAND
running command...
$ freelog-scripts (-v|--version|version)
@freelog/freelog-scripts/0.0.0 darwin-x64 node-v12.16.3
$ freelog-scripts --help [COMMAND]
USAGE
  $ freelog-scripts COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`freelog-scripts hello [FILE]`](#freelog-scripts-hello-file)
* [`freelog-scripts help [COMMAND]`](#freelog-scripts-help-command)

## `freelog-scripts hello [FILE]`

describe the command here

```
USAGE
  $ freelog-scripts hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ freelog-scripts hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/liu-kai-github/freelog-scripts/blob/v0.0.0/src/commands/hello.ts)_

## `freelog-scripts help [COMMAND]`

display help for freelog-scripts

```
USAGE
  $ freelog-scripts help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.1/src/commands/help.ts)_
<!-- commandsstop -->
