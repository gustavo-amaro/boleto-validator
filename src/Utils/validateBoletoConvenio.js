const {
  reverseString,
  getFormatedAmount,
  digitableLineToBarCode,
} = require("./Commons");

/**
 *
 * @param {string} block
 * @returns {int|null}
 */
const modulo10 = (block) => {
  const blockSize = block.length - 1;

  let code = block.substr(0, blockSize);

  code = reverseString(code);
  code = code.split("");

  let sum = 0;

  let index = 0;
  for (let value of code) {
    let newValue = value * (index % 2 == 0 ? 2 : 1);

    /**
     * Quando a soma tiver mais de 1 algarismo(ou seja, maior que 9),
     * soma-se os algarismos antes de somar com somatorio
     */
    if (newValue > 9) {
      sum += newValue
        .toString()
        .split("")
        .reduce(function (sum, current) {
          return parseInt(sum) + parseInt(current);
        });
    } else {
      sum += newValue;
    }

    if (code.length == index + 1) {
      /**
       * (Math.ceil(somatorio / 10) * 10) pega a dezena imediatamente superior ao somatorio
       * (dezena superior de 25 é 30, a de 43 é 50...).
       */
      let roundedFieldMultiplier = Math.ceil(sum / 10) * 10 - sum;

      return roundedFieldMultiplier;
    }

    index++;
  }

  return null;
};

/**
 *
 * @param {string} block
 * @returns {int|null}
 */
const modulo11 = (block) => {
  let blockSize = block.length - 1;
  let roundedFieldMultiplier;

  let code = block.substr(0, blockSize);

  code = reverseString(code);
  code = code.split("");

  let sum = 0,
    index = 0;

  for (let value of code) {
    sum += value * (2 + (index >= 8 ? index - 8 : index));

    if (code.length == index + 1) {
      let restDivision = sum % 11;

      if (restDivision == 0 || restDivision == 1) {
        roundedFieldMultiplier = 0;
      } else if (restDivision == 10) {
        roundedFieldMultiplier = 1;
      } else {
        roundedFieldMultiplier = Math.ceil(sum / 11) * 11 - sum;
      }

      return roundedFieldMultiplier;
    }

    index++;
  }

  return null;
};

const getAmount = (digitableLine) => {
  digitableLine = digitableLine.replace(/[^0-9]/g, "");
  const idAmount = digitableLine.slice(2, 3);
  const isEffectiveAmmount = idAmount === "6" || idAmount === "8";

  let amount = "";
  let finalAmount;

  if (isEffectiveAmmount) {
    amount = digitableLine.slice(4, 11) + digitableLine.slice(12, 16);
    finalAmount = getFormatedAmount(amount);
  } else {
    finalAmount = "0.00";
  }

  return finalAmount;
};

const validateBoletoConvenio = (digitableLine, res) => {
  let blocks = [];

  blocks[0] = digitableLine.substr(0, 12);
  blocks[1] = digitableLine.substr(12, 12);
  blocks[2] = digitableLine.substr(24, 12);
  blocks[3] = digitableLine.substr(36, 12);

  /**
   * Verifica se é o modulo 10 ou modulo 11.
   * Se o 3º digito for 6 ou 7 é modulo 10, se for 8 ou 9, então modulo 11.
   */
  let isModulo10 = ["6", "7"].indexOf(digitableLine[2]) != -1;

  let index = 0;
  for (let block of blocks) {
    if (isModulo10) {
      const verifyingDigit = modulo10(block);
      if (verifyingDigit != block[block.length - 1]) {
        return res.status(400).json({
          message: `O digito verificador do bloco ${index + 1} é inválido!`,
        });
      }
    } else {
      const verifyingDigit = modulo11(block);
      if (verifyingDigit != block[block.length - 1]) {
        return res.status(400).json({
          message: `O digito verificador do bloco ${index + 1} é inválido!`,
        });
      }
    }

    if (blocks.length == index + 1) {
      const amount = getAmount(digitableLine);
      const barCode = digitableLineToBarCode(digitableLine, "CONVENIO");
      return res.json({ barCode, amount, expirationDate: "" });
    }
    index++;
  }
};

module.exports = validateBoletoConvenio;
