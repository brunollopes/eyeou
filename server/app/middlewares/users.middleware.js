const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Contests = require('../models/contest.model');
const Users = require('../models/users.model.js');
const Images = require('../models/image.model.js');

const isLoggedId = (req, res, next) => {
  const { user } = req;
  if (user)
    next();
  else
    return res.status(403).json({ message: "Authorization Error" });
}

const isUserInContest = (req, res, next) => {
  req.locals = {};
  const userId = req.get('userId');

  const query = {
    id: req.params.contestId || req.body.contestId,
    slug: req.params.slug || req.body.slug
  }
  Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);
  Contests
    .findOne(query)
    .exec()
    .then(contest => {
      contest.users.forEach($userId => {
        if ($userId == userId) {
          req.locals.userIncluded = true;
        }
      });
      req.locals.contestId = contest.id;
      next();
    })
    .catch(err => {
      next();
    })
}

module.exports = {
  isUserInContest,
  isLoggedId
}