export type UploadAssetState = {
    errors?: {
        general?: string;
    };
    message?: string;
    success?: boolean;
    status?: string;
    assetURI?: string | string[];
    transactionHash?: string;

};
