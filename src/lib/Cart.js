import Dinero from "dinero.js";
const Money = Dinero;

Money.defaultCurrency = "BRL";
Money.defaultPrecision = 2;

const calculatePercentage = (amount, item) => {
  if (item.condition?.percentage && item.quantity >= item.condition.minimum) {
    return amount.percentage(item.condition.percentage);
  }

  return Money({ amount: 0 });
};

const calculatePercentageQuantity = (amount, item) => {
  if (item.condition?.quantity && item.quantity >= item.condition?.quantity) {
    const par = item.quantity % 2 === 0 ? true : false;

    if (par) {
      return amount.percentage(50);
    }

    if (!par && item.quantity > 2) {
      return amount
        .subtract(Money({ amount: item.product.price }))
        .percentage(50);
    }
  }

  return Money({ amount: 0 });
};

export default class Cart {
  items = [];

  add(item) {
    const indexItem = this.items.findIndex(
      (itemIndex) => itemIndex.product.title === item.product.title
    );

    if (indexItem >= 0) {
      this.items[indexItem].quantity++;
    } else {
      this.items.push(item);
    }
  }

  remove(product) {
    const indexItem = this.items.findIndex(
      (itemIndex) => itemIndex.product.title === product.title
    );

    if (indexItem >= 0) {
      if (this.items[indexItem].quantity > 1) {
        this.items[indexItem].quantity--;
      } else {
        const updatedCart = [...this.items];
        updatedCart.splice(indexItem, 1);
        this.items = updatedCart;
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      const amount = Money({ amount: item.quantity * item.product.price });
      const discount = calculatePercentage(amount, item);
      const discountQuantity = calculatePercentageQuantity(amount, item);

      return total.add(amount).subtract(discount).subtract(discountQuantity);
    }, Money({ amount: 0 }));
  }

  getTotalItems() {
    return this.items.length;
  }

  summary() {
    const total = this.getTotalItems();
    const items = this.items;

    return {
      total,
      items,
    };
  }

  checkout() {
    const total = this.getTotalItems();
    const items = this.items;

    this.items = [];

    return {
      total,
      items,
    };
  }
}
