'use strict';

//# Requirements
var http = require("http");
var request = require("request");
var express = require('express');

//# Export
module.exports = function(conf, cb){
  cb = cb || function(err, req, res){if(err) console.error(err); res.end(err.toString());};
  var app = express();
  
  //# Functions
  var mkVhost = function(domain, modulePath){
    app.use(express.vhost(domain, require(modulePath)));
  }
  var mkRedirect = function(domain, url){
    app.use(express.vhost(domain, function(req, res){
      req.handled = true;
      res.writeHead(301, {"Location": url});
      res.end();
    }));
  }
  var mkProxy = function(domain, url){
    app.use(express.vhost(domain, function(req, res){
      req.handled = true;
      var opts = {headers: req.headers, uri: url+req.url};
      var r = request(opts);
      req.pipe(r).pipe(res);
      r.on("error", function(err){
        cb(err, req, res);
      });
    }));
  }
  
  //# Loops
  var hash;
  for (hash in conf.vhosts) {
    console.log("Register vhost '"+hash+"'...");
    mkVhost(hash, conf.vhosts[hash]);
    console.log("done.");
  }
  
  for (hash in conf.redirects) {
    console.log("Register redirect '"+hash+"'...");
    mkRedirect(hash, conf.redirects[hash]);
    console.log("done.");
  }
  
  for (hash in conf.proxies) {
    console.log("Register proxy '"+hash+"'...");
    mkProxy(hash, conf.proxies[hash]);
    console.log("done.");
  }
  
  //# create and listen to server
  http.createServer(app).listen(conf.port, function(){
    console.log('Express server listening on port '+conf.port);
    console.log("Everything is ready and OK.");
  });
};

