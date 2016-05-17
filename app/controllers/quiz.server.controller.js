'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Quiz = mongoose.model('Quiz'),
    jwt = require('jsonwebtoken'),
  _ = require('lodash');
/**
 * Get the error message from error object
 */
var getErrorMessage = function (err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;
  var message = null;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;
    user.company = req.user.company;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(user);
        /*req.login(user, function(err) {
         if (err) {
         res.status(400).send({message: err.message});
         } else {
         res.jsonp(user);
         }
         });*/
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

exports.read = function (req, res) {
  res.jsonp(req.profile);
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.jsonp(req.user || null);
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  User.findById(id).exec(function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};

/**
 * List of Quiz
 */
exports.list = function (req, res) {
  Quiz.find().exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(users);
    }
  });
};

exports.create = function (req, res) {
  var quiz = new Quiz(req.body);
  quiz.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(quiz);
    }
  });
};

exports.delete = function (req, res) {
  Quiz.findOne({
    id: req.body.id
  }, function (err, docs) {
    console.log(docs);
    docs.remove(); //Remove all the documents that match!
    res.jsonp({
      status: 'OK'
    });
  });
};
