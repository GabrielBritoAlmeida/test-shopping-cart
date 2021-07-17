import Cart from "./Cart";

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

    expect(cart.getTotal().getAmount()).toEqual(70776);
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

    expect(cart.getTotal().getAmount()).toEqual(106164);
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

    expect(cart.getTotal().getAmount()).toEqual(71126);
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

    expect(cart.getTotal().getAmount()).toEqual(35738);
  });

  it("Use method to remove from cart, until the items are zeroed", () => {
    cart.add({
      product,
      quantity: 1,
    });

    cart.add({
      product: product2,
      quantity: 2,
    });

    cart.remove(product);
    cart.remove(product2);

    expect(cart.getTotalItems()).toEqual(1);

    expect(cart.getTotal().getAmount()).toEqual(350);
  });

  it("should clean the cart", () => {
    cart.checkout();

    expect(cart.getTotalItems()).toEqual(0);

    expect(cart.getTotal().getAmount()).toEqual(0);
  });

  it("should consult total items and list of items, with summary method", () => {
    cart.add({
      product,
      quantity: 2,
    });

    cart.add({
      product: product2,
      quantity: 1,
    });

    expect(cart.summary().total).toEqual(2);

    expect(cart.summary().items).toMatchInlineSnapshot(`
Array [
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
]
`);
  });

  describe("getTotalItems", () => {
    it("should return 0 when getTotal() is executed in a newly created", () => {
      expect(cart.getTotal().getAmount()).toEqual(0);
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

  describe("Special discount", () => {
    it("should apply discount, when receiving discount condition, percentage and quantity.", () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        quantity: 3,
        condition,
      });

      expect(cart.getTotal().getAmount()).toEqual(74315);
    });

    it("should not apply discount, minimum quantity lower than expected.", () => {
      const condition = {
        percentage: 30,
        minimum: 4,
      };

      cart.add({
        product,
        quantity: 3,
        condition,
      });

      expect(cart.getTotal().getAmount()).toEqual(106164);
    });

    it("should apply discount, according to quantity, take 2 pay 1.", () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        quantity: 4,
        condition,
      });

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });

    it("apply discount, according to quantity, take 2 pay 1, in odd quantity of products.", () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        quantity: 5,
        condition,
      });

      expect(cart.getTotal().getAmount()).toEqual(106164);
    });

    it("you should not apply a discount, as I have not reached the minimum number of products, in this case a minimum of 2 products.", () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        quantity: 1,
        condition,
      });
      expect(cart.summary().total).toEqual(1);
      expect(cart.getTotal().getAmount()).toEqual(35388);
    });

    it("should remove only one product out of a total of 3.", () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        quantity: 3,
        condition,
      });

      cart.remove(product);
      cart.remove(product);

      expect(cart.summary().total).toEqual(1);
      expect(cart.getTotal().getAmount()).toEqual(35388);
    });

    it("should apply the best discount", () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      const condition2 = {
        quantity: 2,
      };

      cart.add({
        product,
        quantity: 4,
        condition: [condition2, condition],
      });

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });

    
  });
});
