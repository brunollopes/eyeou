const stripe = require('stripe')(process.env.stripe_sk_key)
const User = require('../models/users.model');
const Contest = require('../models/contest.model');
const Transactions = require('../models/transactions.model')

exports.pay = (req, res) => {
  const { email, id } = req.user
  const { token, amount, maxPhotosLimit, contest } = req.body

  stripe.customers.list({
    limit: 1,
    email
  }).then(customers => {
    if (customers.data.length) {
      const customer = customers.data[0]
      createSource(customer.id, token.id)
        .then(source => createCharge(amount, source.customer))
        .then(charge => {
          const $charge = clean(charge)
          Transactions.create({
            ...$charge,
            maxPhotosLimit,
            contest,
            user: id
          }, (err, info) => {
            if (err) return res.status(500).json(err)
            Promise.all([
              User.findByIdAndUpdate(id, { $push: { contests: contest } }, { new: true }).exec(),
              Contest.findByIdAndUpdate(contest, { $push: { users: id } }, { new: true }).exec()
            ])
              .then($info => res.status(200).json({ ...info, slug: $info[1].slug }))
              .catch(error => res.status(500).json(error))
          })
        })
        .catch(error => {
          console.log(err)
          res.send(false)
        })
    } else {
      createCustomer(email)
        .then(customer => createSource(customer.id, token.id))
        .then(source => createCharge(amount, source.customer))
        .then(charge => {
          const $charge = clean(charge)
          Transactions.create({
            ...$charge,
            maxPhotosLimit,
            contest,
            user: id
          }, (err, info) => {
            if (err) return res.status(500).json(err)
            Promise.all([
              User.findByIdAndUpdate(id, { $push: { contests: contest } }, { new: true }).exec(),
              Contest.findByIdAndUpdate(contest, { $push: { users: id } }, { new: true }).exec()
            ])
              .then($info => {
                emailHelper.sendEmail({
                  $mailTo: process.env.owner_email,
                  $subject: `New Contest Subscription`,
                  $html: `<p>${userUpdate.email} payed the contest fee to join <strong>${contestUpdate.contest_name}</strong></p>`
                })
                res.status(200).json({ ...info, slug: $info[1].slug })
              })
              .catch(error => res.status(500).json(error))
          })
        })
        .catch(error => {
          console.log(error)
          res.send(false)
        })
    }
  }).catch(err => {
    console.log(err)
    res.send(true)
  })
}

const createCustomer = (email) => {
  return stripe.customers.create({
    email
  })
    .then(customer => customer)
    .catch(error => error)
}

const createSource = (customerId, token) => {
  return stripe.customers.createSource(customerId, {
    source: token
  })
    .then(source => source)
    .catch(error => error)
}

const createCharge = (amount, customer) => {
  return stripe.charges.create({
    // amount: parseInt(amount) * 100,
    amount: 50,
    currency: 'USD',
    customer
  })
    .then(charge => charge)
    .catch(error => error)
}

const clean = (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}