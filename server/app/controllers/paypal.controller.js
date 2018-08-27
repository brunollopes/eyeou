const paypal = require('paypal-rest-sdk');
const paypalHelper = require('../helpers/paypal.helper');
const Transaction = require('../models/transactions.model');
const User = require('../models/users.model');
const Contest = require('../models/contest.model');
const emailHelper = require('../helpers/mail.helper');

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
  const redirect_urls = {
    return_url: process.env.paypal_return_url,
    cancel_url: process.env.paypal_cancel_url
  };
  const paymentJSON = new paypalHelper.Payment(redirect_urls, req.body.items);

  paypal.payment.create(paymentJSON, (error, payment) => {
    if (error) {
      res.status(403).send(error);
    } else {
      for (var index = 0; index < payment.links.length; index++) {
        if (payment.links[index].rel === 'approval_url') {
          res.status(200).json({ approval_url: payment.links[index].href });
        }
      }
    }
  });
}

exports.execute = (req, res) => {
  const amountReducer = (a, b) => (parseFloat(a.price) + parseFloat(b.price))
  const execute_payment_json = {
    payer_id: req.body.PayerID,
    transactions: [{
      amount: {
        currency: 'EUR',
        total: req.body.items.length > 1 ? req.body.items.reduce(amountReducer) : req.body.items[0].price
      }
    }]
  };

  const { paymentId, contest } = req.body;
  const user = req.user._id;

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
    const trans = new Transaction(payment)
    try {
      const transSaved = await trans.save();
      const userUpdate = await User.findOneAndUpdate({ _id: user }, { $push: { contests: contest } }).exec();
      const contestUpdate = await Contest.findOneAndUpdate({ _id: contest }, { $push: { users: user } }).exec();
      const sentMail = await emailHelper.sendEmail({
        $mailTo: process.env.owner_email,
        $subject: `New Image Is Uploaded`,
        $html: `<p>${userUpdate.email} payed the contest fee to join <strong>${contestUpdate.contest_name}</strong></p>`
      })
      return res.status(200).json({ trans, contestUpdate })
    } catch (e) {
      console.log(e)
      return res.status(403).json(e)
    }

  });
}