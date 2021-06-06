import Cart from './Cart'

describe("Cart", () => {
  it("should return 0 when getTotal() is executed in a newly created", () => {
    const cart = new Cart();
    expect(cart.getTotal()).toEqual(0);
  });
});
