const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Contests = require('../models/contest.model');
const Users = require('../models/users.model.js');
const Images = require('../models/image.model.js');

const isFreeContest = (req, res, next) => {
  const { contestId } = req.body;
  Contests
    .findById(contestId)
    .exec()
    .then(contest => {
      if (contest.entry_price == 0 && contest.type == 'free') {
        next();
      } else {
        res.status(403).json({ message: 'Contest is not free', err: true })
      }
    })
    .catch(err => res.status(500).json(e));
};

module.exports = {
  isFreeContest
}