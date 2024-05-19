"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3Url = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const bucket_name = "aqpel";
const uuid_1 = require("uuid");
const s3 = new s3_1.default({
    region: "eu-north-1",
    // credentials: {
    accessKeyId: process.env.AWS_SECRET_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // },
    signatureVersion: "v4",
});
const getS3Url = (fileExtension, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const Key = `${userId}/${(0, uuid_1.v4)()}.${fileExtension}`;
    const params = {
        //   "conditions": [
        //  {"key" : imageName},
        //   { "bucket": bucket_name },
        //   ["content-length-range", 1048576, 2097152]
        // ]
        Bucket: bucket_name,
        ContentType: `image/${fileExtension}`,
        Key,
        // Expires: 10000,
        // Conditions: [
        //   ["content-length-range", 0, 1000000],
        // {acl: 'public-read'},
        // {success_action_status: "201"},
        // ["starts-with", "$Content-Type", "image/"],
        // {'x-amz-algorithm': 'AWS4-HMAC-SHA256'}
        // ],
        // Fields: {
        //   key: `${userId}/${uuid()}.${fileExtension}`,
        // },
        // ContentLengthRange: [1,20],
        // ContentType: "text/plain",
        // "content-length-range": [1048576, 2097152],
    };
    // const uploadURL = await s3.getSignedUrl("PutObject", params);
    const uploadURL = yield getPresignedUrlPromiseFunction(s3, params);
    // s3.createPresignedPost(params, function (err, data) {
    //   if (err) {
    //     console.log("Error", err);
    //     res.status(500).json({
    //       msg: "Error",
    //       Error: "Error creating presigned URL",
    //     });
    //   } else {
    //     console.log(data)
    //     // res.status(200).json(data);
    //   }
    // });
    return { url: uploadURL, key: Key };
});
exports.getS3Url = getS3Url;
function getPresignedUrlPromiseFunction(s3, s3Params) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield s3.getSignedUrl("putObject", s3Params, function (err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        }
        catch (error) {
            return reject(error);
        }
    }));
}
