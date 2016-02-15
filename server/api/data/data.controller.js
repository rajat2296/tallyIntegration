'use strict';

var _ = require('lodash');
var Data = require('./data.model');
var request=require('request');
var parser=require('xml2js').parseString;
// Get list of datas
exports.index = function(req, res) {
  Data.find(function (err, datas) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(datas);
  });
};

console.log('inside data ctrl');

// Get a single data
exports.show = function(req, res) {
  Data.findById(req.params.id, function (err, data) {
    if(err) { return handleError(res, err); }
    if(!data) { return res.status(404).send('Not Found'); }
    return res.json(data);
  });
};

// Creates a new data in the DB.
exports.create = function(req, res) {
  var postdata=req.body.data;
  console.log(postdata);
  request.post(
    {url:req.body.url,
      body :postdata,
      'Content-Type': 'text/xml'
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        res.status(200).send(body);
      }
    }
  );
};

// Updates an existing data in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Data.findById(req.params.id, function (err, data) {
    if (err) { return handleError(res, err); }
    if(!data) { return res.status(404).send('Not Found'); }
    var updated = _.merge(data, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(data);
    });
  });
};

// Deletes a data from the DB.
exports.destroy = function(req, res) {
  Data.findById(req.params.id, function (err, data) {
    if(err) { return handleError(res, err); }
    if(!data) { return res.status(404).send('Not Found'); }
    data.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

exports.createVoucher = function(req,res){
  console.log("createvoucher");
  var postdata=req.body.data;
  console.log(postdata);
  request.post(
    {url:req.body.url,
      body :postdata,
      'Content-Type': 'text/xml'
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        parser(body, function (err, result) {
          console.log(result);
          res.send(JSON.stringify(result));
        });
      }
    }
  );
};

exports.reports = function(req,res){
  var postdata=req.body.data;
  console.log(postdata);
  request.post(
      {url:'http://localhost:9000',
        body :postdata,
        'Content-Type': 'text/xml'
      },
    function ( error,response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        parser(body, function (err, result) {
          console.log(result);
          res.send(JSON.stringify(result));
        });
      }
      else
      {console.log(error);}
    }
  );
};

exports.testConnection=function(req,res){
  request.post(
    {url:req.body.url,
      body:req.body.data,
      'Content-Type': 'text/xml'
    },
    function ( error,response, body) {
      if (!error && response.statusCode == 200) {
        parser(body, function (err, result) {
          console.log(result);
          res.send(JSON.stringify(result));
        });
      }
      else
      { console.log(error);
        res.status(500).send(error);}
    }
  );
};

function handleError(res, err) {
  return res.status(500).send(err);
}
