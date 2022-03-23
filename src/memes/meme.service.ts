import S3, { ClientConfiguration } from 'aws-sdk/clients/s3';

import { Meme, PostMemeDto } from '.';

import env from '../config';
const {
    AWS_BUCKET_NAME,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_ENDPOINT_URL
} = env;

export const MemeService = new (class {
    private s3: S3;

    constructor(options?: ClientConfiguration) {
        if (!options) {
            options = {
                credentials: {
                    accessKeyId: AWS_ACCESS_KEY_ID,
                    secretAccessKey: AWS_SECRET_ACCESS_KEY
                },
                endpoint: AWS_ENDPOINT_URL,
                s3ForcePathStyle: true
            };
        }
        this.s3 = new S3(options);
    }

    async getAllMemes() {
        return Meme.find();
    }

    // async postMeme(data: PostMemeDto) {

    // }
})();
