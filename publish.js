var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../v-jonspr-get-conversation-members.zip');
var kuduApi = 'https://v-jonspr-get-conversation-members.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$v-jonspr-get-conversation-members';
var password = 'qNJcfwpTHrKqQNrqawRYmbfvysE167w3cPo1QawbRrFHNYmgPHaJBYzYYHXS';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('v-jonspr-get-conversation-members publish');
  } else {
    console.error('failed to publish v-jonspr-get-conversation-members', err);
  }
});