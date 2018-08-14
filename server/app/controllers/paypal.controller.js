const paypal = require('paypal-rest-sdk');
const paypalHelper = require('../helpers/paypal.helper');
const Transaction = require('../models/transactions.model');

exports.check = (req, res) => {
  const { user, contest } = req.params
  console.log(user, contest)
  Transaction
    .findOne({user, contest})
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
          res.status(200).json({approval_url: payment.links[index].href});
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
        currency: 'USD',
        total: req.body.items.length > 1 ? req.body.items.reduce(amountReducer) : req.body.items[0].price
      }
    }]
  };
  const { paymentId } = req.body;
  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.log(error)
      res.status(403).send(error);
    } else {
      payment.transactions.forEach(transaction => {
        delete transaction.related_resources;
      })
      payment.user = req.body.user
      payment.contest = req.body.contest
      const trans = new Transaction(payment)
      trans.save(err => {
        if (err) return res.status(500).send(err)
        console.log(payment)
        return res.status(200).send(trans)
      })
    }
  });
}