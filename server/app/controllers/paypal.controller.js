const paypal = require('paypal-rest-sdk');
const paypalHelper = require('../helpers/paypal.helper');
const Transaction = require('../models/transactions.model');
const User = require('../models/users.model');
const Contest = require('../models/contest.model');
const emailHelper = require('../helpers/mail.helper');
const PendingTransactions = require('../models/pendingTransactions');

exports.check = (req, res) => {
  const { contest } = req.params
  const user = req.user._id;

  Transaction
    .findOne({ user, contest })
    .exec()
    .then(document => {
      res.status(200).json(document)
    })
    .catch(error => {
      res.status(500).send(error)
    })
}

exports.create = (req, res) => {
  const contestId = req.body.items[0].contestId;
  const userId = req.user._id;
  const { photos } = req.body.items[0];
  const price = paypalHelper.getPrice(photos)
  Contest.findById(contestId, ['contest_name', '_id']).exec()
    .then(contest => {
      const paymentJSON = new paypalHelper.Payment([contest], price)
      paypal.payment.create(paymentJSON, (error, payment) => {
        if (error) {
          res.status(403).send(error);
        } else {
          for (var index = 0; index < payment.links.length; index++) {
            if (payment.links[index].rel === 'approval_url') {
              PendingTransactions.deleteMany({ user: userId }, (err) => {
                PendingTransactions.create({ user: userId, contest: contestId, transaction: paymentJSON })
              });
              res.status(200).json({ approval_url: payment.links[index].href });
            }
          }
        }
      });
    })
    .catch(err => res.status(404).send(err))
}

exports.execute = async (req, res) => {
  const { paymentId, contest } = req.body;
  const user = req.user._id;

  try {
    const $transaction = await PendingTransactions.findOne({ user }, ['_id', 'transaction']);
    const execute_payment_json = {
      payer_id: req.body.PayerID,
      transactions: [{ amount: $transaction.transaction.transactions[0].amount }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
      if (error) {
        console.log('>> PAYPAL EXEC ERROR:', error)
        return res.status(403).send(error);
      }

      payment.transactions.forEach(transaction => {
        delete transaction.related_resources;
      })

      payment.user = user
      payment.contest = contest
      payment.maxPhotosLimit = paypalHelper.getMaxPhotoLength($transaction.transaction.transactions[0].amount.total)
      const trans = new Transaction(payment)
      trans.save();
      Promise.all([
        User.findOneAndUpdate({ _id: user }, { $push: { contests: contest } }, { new: true }).exec(),
        Contest.findOneAndUpdate({ _id: contest }, { $push: { users: user } }, { new: true }).exec()
      ])
        .then(resolve => {
          const userUpdate = resolve[0]
          const contestUpdate = resolve[1]
          emailHelper.sendEmail({
            $mailTo: process.env.owner_email,
            $subject: `New Contest Subscription`,
            $html: `<p>${userUpdate.email} payed the contest fee to join <strong>${contestUpdate.contest_name}</strong></p>`
          })
          return res.status(200).json({ trans, contestUpdate })
        })
    });
  } catch (e) {
    console.log(e)
    return res.redirect('/')
  }

}