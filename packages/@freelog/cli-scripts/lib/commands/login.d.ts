import { Command } from '@oclif/command';
export default class Logon extends Command {
    static description: string;
    static examples: string[];
    run(): Promise<{
        cookies: any;
        userInfo: any;
    }>;
}
export declare function getCookies(forceLogin?: boolean): Promise<string>;
export declare function getUserInfo(forceLogin?: boolean): Promise<any>;
