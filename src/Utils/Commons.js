/**
 *
 * @param {string} string
 * @returns string ao reverso
 */
const reverseString = (string = "") => {
  const splitString = string.split("");
  const reverseStringArray = splitString.reverse();
  return reverseStringArray.join("");
};

/**
 *
 * @param {string} amount
 * @returns valor do boleto formatado
 */
const getFormatedAmount = (amount) => {
  amount = parseFloat(amount);
  amount = amount / 100;

  return amount.toFixed(2);
};

/**
 *
 * @param {string} digitableLine
 * @param {'TITULO'|'CONVENIO'} type
 * @returns código de barras
 */
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
  getFormatedAmount,
  reverseString,
  digitableLineToBarCode,
};
