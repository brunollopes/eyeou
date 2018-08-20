exports.Payment = class Payment {
  constructor(redirect_urls, items) {
    this.intent = "authorize";
    this.payer = {
      payment_method: "paypal"
    }
    this.redirect_urls = redirect_urls;
    this.transactions = [new Transaction(items)];
  }
}

class Transaction {
  constructor(items) {
    this.amountReducer = (a, b) => (parseFloat(a.price) + parseFloat(b.price));
    this.item_list = {items: []}
    this.item_list.items = items.map(item => new Item(item));
    this.amount = {
      currency: 'EUR',
      total: this.item_list.items.length > 1 ? this.item_list.items.reduce(this.amountReducer) : this.item_list.items[0].price
    };
    this.description = "Description"
  }
}

class Item {
  constructor({name, sku, price, currency, quantity}) {
    this.name = name;
    this.sku = sku;
    this.price = price;
    this.currency = currency;
    this.quantity = quantity;
  }
}