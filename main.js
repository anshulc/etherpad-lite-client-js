// Generated by CoffeeScript 1.4.0
(function() {
  var http, querystring, url, _;

  http = require('http');

  url = require('url');

  querystring = require('querystring');

  _ = require('underscore');

  exports.connect = function(options) {
    var api, apiFunctions, functionName, _base, _base1, _fn, _i, _len;
    if (options == null) {
      options = {};
    }
    if (!('apikey' in options)) {
      throw new Error('You must specify etherpad-lite apikey');
    }
    api = {};
    api.options = _.extend({}, options);
    (_base = api.options).host || (_base.host = 'localhost');
    (_base1 = api.options).port || (_base1.port = 9001);
    api.call = function(functionName, functionArgs, callback) {
      var apiOptions, chunks, httpOptions, req, rootPath;
      rootPath = '/api/1/';
      apiOptions = _.extend({
        'apikey': this.options.apikey
      }, functionArgs);
      httpOptions = {
        host: this.options.host,
        port: this.options.port,
        path: rootPath + functionName + '?' + querystring.stringify(apiOptions)
      };
      chunks = [];
      req = http.get(httpOptions, function(res) {
        res.on('data', function(data) {
          return chunks.push(data);
        });
        return res.on('end', function() {
          var response;
          try {
            response = JSON.parse(chunks.join(''));
          } catch (error) {
            callback({
              code: -1,
              message: 'cannot parse the API response'
            }, null);
            return;
          }
          if (response.code === 0 && response.message === 'ok') {
            return callback(null, response.data);
          } else {
            return callback({
              code: response.code,
              message: response.message
            }, null);
          }
        });
      });
      return req.on('error', function(error) {
        return callback({
          code: -1,
          message: error.message || error
        }, null);
      });
    };
    apiFunctions = ['createGroup', 'createGroupIfNotExistsFor', 'deleteGroup', 'listPads', 'createGroupPad', 'listAllGroups', 'createAuthor', 'createAuthorIfNotExistsFor', 'listPadsOfAuthor', 'getAuthorName', 'createSession', 'deleteSession', 'getSessionInfo', 'listSessionsOfGroup', 'listSessionsOfAuthor', 'getText', 'setText', 'getHTML', 'createPad', 'getRevisionsCount', 'padUsersCount', 'padUsers', 'deletePad', 'getReadOnlyID', 'setPublicStatus', 'getPublicStatus', 'setPassword', 'isPasswordProtected', 'listAuthorsOfPad', 'getLastEdited', 'sendClientsMessage'];
    _fn = function(functionName) {
      return api[functionName] = function(args, callback) {
        if (arguments.length === 1 && _.isFunction(args)) {
          callback = args;
          args = {};
        }
        if (callback == null) {
          callback = (function() {});
        }
        api.call(functionName, args, callback);
        return null;
      };
    };
    for (_i = 0, _len = apiFunctions.length; _i < _len; _i++) {
      functionName = apiFunctions[_i];
      _fn(functionName);
    }
    return api;
  };

}).call(this);