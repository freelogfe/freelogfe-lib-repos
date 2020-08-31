export declare const serverOrigin: string;
export declare const aliyuncsPagebuildUrl: string;
export declare const projectPackage: any;
export declare const colorLog: {
    success: (str: string) => void;
    error: (str: string) => void;
    warning: (str: string) => void;
};
export declare const devServerProxy: {
    '/v1': {
        changeOrigin: boolean;
        target: string;
    };
};
