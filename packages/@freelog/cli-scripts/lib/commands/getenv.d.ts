import { Command } from '@oclif/command';
export default class EnvGetter extends Command {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
export declare function run(): Promise<string>;
