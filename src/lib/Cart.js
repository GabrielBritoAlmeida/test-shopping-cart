import Dinero from "dinero.js";
const Money = Dinero;

Money.defaultCurrency = "BRL";
Money.defaultPrecision = 2;

const calculatePercentage = (amount, itemProduct, condition) => {
  if (condition.percentage && itemProduct.quantity >= condition.minimum) {
    return amount.percentage(condition.percentage);
  }

  return Money({ amount: 0 });
};

const calculatePercentageQuantity = (amount, itemProduct, condition) => {
  if (condition.quantity && itemProduct.quantity >= condition.quantity) {
    const par = itemProduct.quantity % 2 === 0 ? true : false;

    if (par) {
      return amount.percentage(50);
    }

    if (!par && itemProduct.quantity > 2) {
      return amount
        .subtract(Money({ amount: itemProduct.product.price }))
        .percentage(50);
    }
  }

  return Money({ amount: 0 });
};

const calculateBestDiscount = (amount, item) => {
  const itemProduct = item;

  if (item.condition) {
    const condition = Array.isArray(item.condition)
      ? item.condition
      : [item.condition];

    const [bestDiscount] = condition
      .map((cond) => {
        if (cond.percentage) {
          return calculatePercentage(amount, itemProduct, cond);
        }

        if (cond.quantity) {
          return calculatePercentageQuantity(amount, itemProduct, cond);
        }
      })
      .sort((a, b) => b - a);

    return bestDiscount;
  }

  return null;
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

    return;
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      const amount = Money({ amount: item.quantity * item.product.price });
      const discount = calculateBestDiscount(amount, item);
      // console.log("🚀 discount: ", discount.getAmount())

      if (discount) {
        return total.add(amount).subtract(discount);
      }

      return total.add(amount);
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
