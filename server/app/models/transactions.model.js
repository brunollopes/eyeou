const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TransactionSchema = mongoose.Schema({
  transactionId: String,
  intent: String,
  state: String,
  cart: String,
  payer: {
    payment_method: String,
    status: String,
    payer_info: {
      email: String,
      first_name: String,
      last_name: String,
      payer_id: String,
      shipping_address: {
        recipient_name: String,
        line1: String,
        city: String,
        state: String,
        postal_code: String,
        country_code: String
      },
      country_code: String
    }
  },
  transactions: [{
    amount: {
      total: String,
      currency: String
    },
    payee: {
      merchant_id: String,
      email: String
    },
    description: String,
    item_list: {
      items: [{
        name: String,
        sku: String,
        price: String,
        currency: String,
        quantity: Number
      }]
    },
    shipping_address: {
      recipient_name: String,
      line1: String,
      city: String,
      state: String,
      postal_code: String,
      country_code: String
    }
  }],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  contest: { type: Schema.Types.ObjectId, ref: 'Contest' }
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transactions', TransactionSchema);