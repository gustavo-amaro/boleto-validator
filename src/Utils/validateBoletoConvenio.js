const { reverseString } = require("./Commons");

const modulo10 = (block, callback) => {
  const blockSize = block.length - 1;

  let code = block.substr(0, blockSize);

  code = reverseString(code);
  code = code.split("");

  let sum = 0;

  code.forEach(function (value, index) {
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

      callback(roundedFieldMultiplier);
    }
  });
};

const modulo11 = (block, callback) => {
  let blockSize = block.length - 1;
  let roundedFieldMultiplier;

  let code = block.substr(0, blockSize);

  code = reverseString(code);
  code = code.split("");

  let sum = 0;

  code.forEach(function (value, index) {
    sum += value * (2 + (index >= 8 ? index - 8 : index));

    if (code.length == index + 1) {
      let restoDivisao = sum % 11;

      if (restoDivisao == 0 || restoDivisao == 1) {
        roundedFieldMultiplier = 0;
      } else if (restoDivisao == 10) {
        roundedFieldMultiplier = 1;
      } else {
        roundedFieldMultiplier = Math.ceil(somatorio / 11) * 11 - somatorio;
      }

      callback(roundedFieldMultiplier);
    }
  });
};

const validateBoletoConvenio = (barCode, res) => {
  let blocks = [];

  blocks[0] = barCode.substr(0, 12);
  blocks[1] = barCode.substr(12, 12);
  blocks[2] = barCode.substr(24, 12);
  blocks[3] = barCode.substr(36, 12);

  /**
   * Verifica se é o modulo 10 ou modulo 11.
   * Se o 3º digito for 6 ou 7 é modulo 10, se for 8 ou 9, então modulo 11.
   */
  let isModulo10 = ["6", "7"].indexOf(barCode[2]) != -1;
  let valid = 0;

  blocks.forEach(function (block, index) {
    if (isModulo10) {
      modulo10(block, function (digitoVerificador) {
        if (digitoVerificador == block[block.length - 1]) valid++;
      });
    } else {
      modulo11(block, function (digitoVerificador) {
        if (digitoVerificador == block[block.length - 1]) valid++;
      });
    }

    if (blocks.length == index + 1) {
      return res.json({ valid: valid == 4 });
    }
  });
};

module.exports = validateBoletoConvenio;
