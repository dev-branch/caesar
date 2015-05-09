/* eslint no-empty: 0 */
'use strict';

var Secrets;

try{
  Secrets = require('./secrets');
}catch(ex){}

exports.get = function(){
  var env = process.env.NODE_ENV || 'development';

  var common = {
    FIREBASE_SECRET: process.env.FIREBASE_SECRET || Secrets.FIREBASE_SECRET,
    FIREBASE_EXPIRE: 24
  };

  var environments = {
    development: {
      PORT: process.env.PORT || 8000,
      MONGO_URL: 'mongodb://localhost/caesar-dev'
    },
    test: {
      PORT: process.env.PORT || 0,
      MONGO_URL: 'mongodb://localhost/caesar-test',
      FIREBASE_EXPIRE: Infinity,
      FIREBASE_TOKEN: process.env.FIREBASE_TOKEN || Secrets.FIREBASE_TOKEN
    },
    production: {
      PORT: process.env.PORT || 0,
      MONGO_URL: 'mongodb://heroku.mongolab.com'
    }
  };

  var environment = environments[env];

  Object.keys(common).forEach(function(key){
    if(!environment[key]){
      environment[key] = common[key];
    }
  });

  return environment;
};
