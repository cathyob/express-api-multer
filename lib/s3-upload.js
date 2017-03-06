'use strict';

require('dotenv').load();

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const crypto = require('crypto');

const s3Upload = (options)=> {
  let mimeType = mime.lookup(options.path);
  let ext = path.extname(options.path);

  // get the date, changes date to string, splits up-to time, and only give the first part before time
  let folder = (new Date()).toISOString().split('T')[0];
  let stream = fs.createReadStream(options.path);

  // have to add return here to allow it to work
  return new Promise((resolve, reject) => {
    // randomBytes takes a callback but we want it to be a Promise
    crypto.randomBytes(16, (error, buffer) =>{
      // if an error skip everything by rejecting
      if(error){
        reject(error);
      }
      // otherwise, if no error change the buffer to a string
      else {
        console.log("buffer is ", buffer);
        console.log("buffer.toS is ", buffer.toString('hex'));
        resolve(buffer.toString('hex'));
      }
    });
  // if no error, then do this...
  }).then((filename)=>{
    // create the file name with the info that has been provided
    let params = {
      ACL: 'public-read',
      ContentType: mimeType,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${folder}/${filename}${ext}`,
      Body: stream
    };

    // make a new promise
    // promise version
    return new Promise((resolve, reject) => {
      // call s3.upload
      s3.upload(params, function (error, data) {
        if(error){
          // if an error occurs here skip everything else
          // console.log(error);
          reject(error);
        }
        else {
          // otherwise, if no error resolve the data
          // console.log(data);
          resolve(data);
        }
      });
    });
  });
};

module.exports = s3Upload;
