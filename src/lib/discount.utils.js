import Dinero from "dinero.js";
const Money = Dinero;

Money.defaultCurrency = "BRL";
Money.defaultPrecision = 2;

const calculatePercentage = (amount, quantity, { minimum, percentage }) => {
  if (percentage && quantity >= minimum) {
    return amount.percentage(percentage);
  }

  return Money({ amount: 0 });
};

const calculatePercentageQuantity = (
  amount,
  { quantity, product },
  condition
) => {
  if (condition.quantity && quantity >= condition.quantity) {
    const par = quantity % 2 === 0 ? true : false;

    if (par) {
      return amount.percentage(50);
    }

    if (!par && quantity > 2) {
      return amount.subtract(Money({ amount: product.price })).percentage(50);
    }
  }

  return Money({ amount: 0 });
};

export const calculateBestDiscount = (amount, item) => {
  debugger;
  
  if (item.condition) {
    const condition = Array.isArray(item.condition)
      ? item.condition
      : [item.condition];

    const [bestDiscount] = condition
      .map((cond) => {
        if (cond.percentage) {
          return calculatePercentage(amount, item.quantity, cond);
        }

        if (cond.quantity) {
          return calculatePercentageQuantity(amount, item, cond);
        }
      })
      .sort((a, b) => b - a);

    return bestDiscount;
  }

  return null;
};
