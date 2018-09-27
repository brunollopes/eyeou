const Users = require('../models/users.model');
const Contests = require('../models/contest.model');
const Transactions = require('../models/transactions.model');
const Vouchers = require('../models/vouchers.model');
const MailHelper = require('../helpers/mail.helper');

exports.create = (req, res) => {
  const { code, limit } = req.body;
  const voucher = new Vouchers({ code, limit })

  voucher
    .save()
    .then(info => {
      console.log('>> Voucher Created', info)
      return res.status(200).json(info)
    })
    .catch(error => {
      console.log('>> ERROR:', error)
      return res.status(500).json(error)
    })
}

exports.activate = (req, res) => {
  const { id } = req.user;
  const { contestId, code } = req.body;

  Vouchers
    .findOne({ code })
    .exec()
    .then(voucher => {
      if (voucher) {
        if (voucher.users.indexOf(id) > -1) {
          return res.status(403).send('You have already used this voucher');
        }
        if (voucher.limit <= voucher.used) {
          return res.status(403).send('This voucher can not be used anymore')
        }
        const transaction = new Transactions({
          voucher: voucher.id, user: id, contest: contestId, maxPhotosLimit: 1
        })
        Promise.all([
          transaction.save(),
          Vouchers.findByIdAndUpdate(voucher.id, { $push: { users: id }, used: voucher.used + 1 }).exec()
        ])
          .then(async info => {
            const contestUpdate = await Contests.findByIdAndUpdate(contestId, { $push: { users: id } }, { new: true }).exec()
            const userUpdate = await Users.findByIdAndUpdate(id, { $push: { contests: contestId } }).exec()

            MailHelper.sendEmail({
              $mailTo: 'iMustafa97@outlook.com',
              $html: '<h1>Promo Code Activated</h1>',
              $subject: 'Promo Code'
            })

            return res.status(200).send(contestUpdate)
          })
          .catch(error => {
            console.log('>> ERROR 1 ', error)
            return res.status(500).json(error)
          })
      } else {
        return res.status(403).send('Invalid voucher code')
      }

    })
    .catch(error => {
      console.log('>> ERROR 2', error)
      return res.status(500).json(error)
    })
}