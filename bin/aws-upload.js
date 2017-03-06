'use strict';

require('dotenv').load();

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const path = require('path');
const mime = require('mime');

// process.argv is how you access scripts in terminal
let file = {
  path: process.argv[2],
  title: process.argv[3]
};

let mimeType = mime.lookup(file.path);
let ext = path.extname(file.path);

let stream = fs.createReadStream(file.path);

console.log("stream is ", stream);

let params = {
  ACL: 'public-read',
  ContentType: mimeType,
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  Key: `${file.title}${ext}`,
  Body: stream
};

s3.upload(params, function (err, data) {
  console.log(err, data);
});
