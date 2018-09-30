const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Contests = require('../models/contest.model');
const Transactions = require('../models/transactions.model')

const isLoggedId = (req, res, next) => {
  const user = req.user ? req.user : { _id: false }
  // const { user_id } = req.body
  if (user._id)
    next();
  else
    return res.status(403).json({ message: "Authorization Error: User is not logged in" });
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
    .findOne(query, ['id', 'users', 'type'])
    .exec()
    .then(async contest => {
      if (contest.users.indexOf(userId) > -1) {
        if (contest.type == 'paid') {
          try {
            const $transactions = await Transactions.find({ user: userId, contest: contest._id }, ['maxPhotosLimit', '_id']).exec()
            req.locals.userIncluded = true;
            req.locals.transaction = $transactions;
            req.locals.contestId = contest.id;
            next();
          } catch (e) {
            req.locals.userIncluded = false;
            next()
          }
        } else {
          req.locals.userIncluded = true;
          req.locals.contestId = contest.id;
          next()
        }
      } else {
        next()
      }
    })
    .catch(err => {
      next();
    })
}

module.exports = {
  isUserInContest,
  isLoggedId
}