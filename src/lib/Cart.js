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

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }

  getTotalItems() {
    console.log("🚀 ~ file: Cart.js ~ line 25 ~ Cart ~ getTotalItems ~ this.items", this.items)
    return this.items.length;
  }
}
