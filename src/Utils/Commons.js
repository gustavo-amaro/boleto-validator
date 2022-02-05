const reverseString = (string = "") => {
  const splitString = string.split("");
  const reverseStringArray = splitString.reverse();
  return reverseStringArray.join("");
};

const getExpirationDate = (expirationDateFactor) => {
  expirationDateFactor = parseInt(expirationDateFactor);
  const baseDate = "1997-10-07";
  const expirationDate = new Date(baseDate);
  expirationDate.setDate(expirationDate.getDate() + expirationDateFactor);

  return expirationDate.toISOString().slice(0, 10);
};

const getFormatedAmount = (amount) => {
  amount = parseFloat(amount);
  amount = amount / 100;

  return amount.toFixed(2);
};

module.exports = {
  getExpirationDate,
  getFormatedAmount,
  reverseString,
};
