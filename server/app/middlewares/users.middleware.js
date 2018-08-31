const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Contests = require('../models/contest.model');
const Transactions = require('../models/transactions.model')

const isLoggedId = (req, res, next) => {
  const { user } = req;
  if (user)
    next();
  else
    return res.status(403).json({ message: "Authorization Error" });
}

const isUserInContest = (req, res, next) => {
  req.locals = {};
  const userId = req.user.id

  const query = {
    id: req.params.contestId || req.body.contestId,
    slug: req.params.slug || req.body.slug
  }
  Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);
  Contests
    .findOne(query)
    .exec()
    .then(contest => {
      contest.users.forEach(async $userId => {
        if ($userId == userId) {
          const $transaction = await Transactions.findOne({ user: userId, contest: contest._id }, ['maxPhotosLimit', '_id']).exec()
          req.locals.userIncluded = true;
          req.locals.transaction = $transaction;
          req.locals.contestId = contest.id;
          next()
        }
      });
    })
    .catch(err => {
      next();
    })
}

module.exports = {
  isUserInContest,
  isLoggedId
}