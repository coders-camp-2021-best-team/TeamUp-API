import S3 from 'aws-sdk/clients/s3';
import Multer from 'multer';
import MulterS3 from 'multer-s3';
import { extname } from 'path';

import env from '../config';
const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_ENDPOINT_URL,
    AWS_BUCKET_NAME
} = env;

export const S3Service = new (class {
    public readonly s3: S3;
    public readonly upload: Multer.Multer;

    constructor() {
        this.s3 = new S3({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            },
            endpoint: AWS_ENDPOINT_URL,
            s3ForcePathStyle: true
        });

        this.upload = Multer({
            storage: MulterS3({
                s3: this.s3,
                bucket: AWS_BUCKET_NAME,
                contentType: (req, file, cb) => cb(null, file.mimetype)
            }),
            limits: {
                files: 10
            },
            fileFilter: (req, file, cb) => {
                if (
                    !['image/png', 'image/jpeg', 'image/gif'].includes(
                        file.mimetype
                    )
                ) {
                    return cb(new Error('Unsupported MIME type'));
                }
                cb(null, true);
            }
        });
    }

    deleteFile(Key: string) {
        return this.s3
            .deleteObject({
                Bucket: AWS_BUCKET_NAME,
                Key
            })
            .promise();
    }
})();
