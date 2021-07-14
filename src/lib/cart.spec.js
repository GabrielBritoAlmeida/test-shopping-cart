import Cart from "./Cart";
import Dinero from "dinero.js";

const Money = Dinero;

Money.defaultCurrency = "BRL";
Money.defaultPrecision = 2;

describe("Cart", () => {
  let cart;
  let product = {
    title: "Adidas",
    price: 35388,
  };

  let product2 = {
    title: "Nike",
    price: 350,
  };

  beforeEach(() => {
    cart = new Cart();
  });

  it("should multiply quantity and price and receive the total amount", () => {
    const item = {
      product,
      quantity: 2,
    };

    cart.add(item);

    expect(cart.getTotal()).toEqual(70776);
  });

  it("should ensure no more than on product exist at a time", () => {
    cart.add({
      product,
      quantity: 2,
    });

    cart.add({
      product,
      quantity: 1,
    });

    expect(cart.getTotalItems()).toEqual(1);

    expect(cart.getTotal()).toEqual(106164);
  });

  it("must ensure that different products are added to the shopping cart", () => {
    cart.add({
      product,
      quantity: 2,
    });

    cart.add({
      product: product2,
      quantity: 1,
    });

    expect(cart.getTotalItems()).toEqual(2);

    expect(cart.getTotal()).toEqual(71126);
  });

  it("check if the quantity of products and total value are correct when removing the product", () => {
    cart.add({
      product,
      quantity: 2,
    });

    cart.add({
      product: product2,
      quantity: 1,
    });

    cart.remove(product);

    // 35388 +350 = 35738

    expect(cart.getTotalItems()).toEqual(2);

    expect(cart.getTotal()).toEqual(35738);
  });

  it("Use method to remove from cart, until the items are zeroed", () => {
    cart.add({
      product,
      quantity: 1,
    });

    cart.add({
      product: product2,
      quantity: 1,
    });

    cart.remove(product);
    cart.remove(product2);

    expect(cart.getTotalItems()).toEqual(0);

    expect(cart.getTotal()).toEqual(0);
  });

  it("must clean the cart", () => {
    cart.checkout();

    expect(cart.getTotalItems()).toEqual(0);

    expect(cart.getTotal()).toEqual(0);
  });

  describe("getTotalItems", () => {
    it("should return 0 when getTotal() is executed in a newly created", () => {
      expect(cart.getTotal()).toEqual(0);
    });

    it("should return the number of items in the cart", () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      expect(cart.getTotalItems()).toMatchInlineSnapshot(`2`);
    });

    it("should return the list with all items in the cart and total items in the cart.", () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      expect(cart.checkout()).toMatchInlineSnapshot(`
        Object {
          "items": Array [
            Object {
              "product": Object {
                "price": 35388,
                "title": "Adidas",
              },
              "quantity": 2,
            },
            Object {
              "product": Object {
                "price": 350,
                "title": "Nike",
              },
              "quantity": 1,
            },
          ],
          "total": 2,
        }
      `);
    });
  });
});
