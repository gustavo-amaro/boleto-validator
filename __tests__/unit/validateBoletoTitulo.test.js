const BoletoController = require("../../src/Controllers/BoletoController");

const boletoController = new BoletoController();

test("validação de boleto com linha digitável válida", () => {
  const digitableLine = "21290001192110001210904475617405975870000002000";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.barCode).toBe("21299758700000020000001121100012100447561740");
  expect(response.amount).toBe("20.00");
  expect(response.expirationDate).toBe("2018-07-16");
});

test("validação de boleto com linha digitável inválida", () => {
  const digitableLine = "21290001192110001210904475617405975870000002010";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
});

test("validação de boleto com tamanho da linha digitável inválido", () => {
  const digitableLine = "2129000119211000121090447561740597587000000200000";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
  expect(response.message).toBe("A linha digitável deve 47 ou 48 números.");
});

test("validação de boleto com código verificador do campo 1 inválido", () => {
  const digitableLine = "21290001152110001210904475617405975870000002000";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
  expect(response.message).toBe("O digito verificador do campo 1 é inválido!");
});

test("validação de boleto com código verificador do campo 2 inválido", () => {
  const digitableLine = "21290001192110001210504475617405975870000002000";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
  expect(response.message).toBe("O digito verificador do campo 2 é inválido!");
});

test("validação de boleto com código verificador do campo 3 inválido", () => {
  const digitableLine = "21290001192110001210904475617409975870000002000";
  const req = {
    params: { digitableLine },
  };
  const res = {
    json: (response) => response,
    status: (statusCode) => {
      return {
        json: (response) => ({ ...response, status: statusCode }),
      };
    },
  };

  const response = boletoController.validateBoleto(req, res);

  expect(response.status).toBe(400);
  expect(response.message).toBe("O digito verificador do campo 3 é inválido!");
});
