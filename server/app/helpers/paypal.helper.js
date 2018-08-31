exports.Payment = class Payment {
  constructor(items, price) {
    this.intent = "authorize";
    this.payer = {
      payment_method: "paypal"
    }
    this.redirect_urls = {
      return_url: process.env.paypal_return_url,
      cancel_url: process.env.paypal_cancel_url
    };
    this.transactions = [new Transaction(items, price)];
  }
}

exports.getPrice = (photos) => {
  let price;
  switch (photos) {
    case "1":
      price = "2";
      break;
    case "10":
      price = "15";
      break;
    case "30":
      price = "35";
      break;
  }
  return price
}

exports.getMaxPhotoLength = (price) => {
  let photos;
  switch (price) {
    case "2":
      price = "1";
      break;
    case "15":
      price = "10";
      break;
    case "35":
      price = "30";
      break;
  }
  return price
}

class Transaction {
  constructor(items, price) {
    this.amountReducer = (a, b) => (parseFloat(a.price) + parseFloat(b.price));
    this.item_list = { items: [] }
    this.item_list.items = items.map(item => new Item(item, price));
    this.amount = {
      currency: 'EUR',
      total: this.item_list.items.length > 1 ? this.item_list.items.reduce(this.amountReducer) : this.item_list.items[0].price
    };
    this.description = "Description"
  }
}

class Item {
  constructor(item, price) {
    this.name = `${item.contest_name} - Contest fee`;
    this.sku = '111';
    this.price = price;
    this.currency = 'EUR';
    this.quantity = "1";
  }
}