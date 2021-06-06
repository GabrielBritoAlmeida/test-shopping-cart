export default class Cart {
  items = [];

  add(item) {
    this.items.push(item);
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }
}
