'use strict';

require('dotenv').load();

const s3Upload = require('../lib/s3-upload.js');
const Upload = require('../app/models/upload');
const mongoose = require('../app/middleware/mongoose');

// Upload.create(title, url);

// NOTE after we wrote s3-upload the only thing we really removed was let
// NOTE file so we want to remove the opposide (aka, everything else) from
// NOTE here and then added s3-upload as a required file (see line 11)
// process.argv is how you access scripts in terminal
let file = {
  path: process.argv[2],
  title: process.argv[3]
};

// NOTE and add this (doesn't have to match s3-upload = (options) as long
// NOTE as it includes what we need (aka file includes path so we're good))
s3Upload(file)
  .then((s3Response)=>{
    // get the url
    let url = s3Response.Location;
    return Upload.create({
      title: file.title,
      url: url,
    });
  })
  .then(console.log)
  .catch(console.error)
  .then(()=> mongoose.connection.close());
