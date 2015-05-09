'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Server = require('../../lib/server');
var Config = require('../../lib/config');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

describe('GET /version', function () {
  describe('NONSTD', function(){
    before(function(done){
      delete process.env.NODE_ENV;
      process.env.PORT = 3333;
      process.env.FIREBASE_SECRET = 'abc';
      process.env.FIREBASE_TOKEN = 'def';
      done();
    });

    it('does stuff', function(done){
      var env = Config.get();

      expect(env.PORT).to.equal('3333');
      done();
    });
  });

  describe('STANDARD', function(){
    before(function(done){
      process.env.NODE_ENV = 'test';
      delete process.env.PORT;
      delete process.env.FIREBASE_SECRET;
      delete process.env.FIREBASE_TOKEN;

      Server.init(function (err, srv) {
        console.log('server env is', srv.app);
        if(err){
          throw err;
        }

        //console.log('environment:', server.app);
        server = srv;
        done();
      });
    });

    after(function(done){
      server.stop(done);
    });

    it('returns the version from package.json - with token', function (done) {
      server.inject({method: 'get', url: '/version', headers: {authorization: 'Bearer ' + server.app.environment.FIREBASE_TOKEN}}, function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('returns the version from package.json - bad token', function (done) {
      server.inject({method: 'get', url: '/version'}, function (res) {
        expect(res.statusCode).to.equal(401);
        done();
      });
    });

    it('returns the version from package.json - direct access', function (done) {
      server.inject({method: 'get', url: '/version', credentials: {username: 'bob'}}, function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
});
