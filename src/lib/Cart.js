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
      return total + item.quantity * item.product.price;
    }, 0);
  }

  getTotalItems() {
    return this.items.length;
  }

  checkout() {
    return {
      total: this.getTotalItems(),
      items: this.items
    }
  }
}
