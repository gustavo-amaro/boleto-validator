const reverseString = (string = "") => {
  const splitString = string.split("");
  const reverseStringArray = splitString.reverse();
  return reverseStringArray.join("");
};

const getExpirationDate = (digitableLine) => {
  let expirationDateFactor = digitableLine.slice(33, 37);
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

const digitableLineToBarCode = (digitableLine, type) => {
  digitableLine = digitableLine.replace(/[^0-9]/g, "");

  let resultado = "";

  if (type == "TITULO") {
    resultado =
      digitableLine.substr(0, 4) +
      digitableLine.substr(32, 1) +
      digitableLine.substr(33, 14) +
      digitableLine.substr(4, 5) +
      digitableLine.substr(10, 10) +
      digitableLine.substr(21, 10);
  } else {
    digitableLine = digitableLine.split("");
    digitableLine.splice(11, 1);
    digitableLine.splice(22, 1);
    digitableLine.splice(33, 1);
    digitableLine.splice(44, 1);
    digitableLine = digitableLine.join("");

    resultado = digitableLine;
  }

  return resultado;
};

module.exports = {
  getExpirationDate,
  getFormatedAmount,
  reverseString,
  digitableLineToBarCode,
};
