# Validador de boletos - Desafio Ewally

Um simples validador de boletos.

## Requisitos

- ter o [Node.js](https://nodejs.org/en/) instalado em sua última versão.

## Como Usar

    1. Clonar este repositório
    2. Instalar as depedências com yarn install ou npm install
    3. Copiar o conteúdo do arquivo .env.example para um novo arquivo chamado .env
    4. Rodar o comando 'start'(npm run start ou yarn start)
    5. Com isso a aplicação estará pronta para ser usada rodando na porta 8080 (a porta pode ser alterado no .env)

A aplicação expõe um endpoint do tipo 'GET' no endereço `http://localhost:8080/boleto/{linhaDigitávelDoBoleto}`, onde é retornado um json contendo:

```
status​ : 200 para linha válida ou 400 para linha inválida
amount​ : O valor do boleto, se existir
expirationDate​ : A data de vencimento do boleto, se existir
barCode​ : Os 44 dígitos correspondentes ao código de barras desse boleto
```

## Exemplo

### Request

GET `http://localhost:8080/boleto/21290001192110001210904475617405975870000002000`

### Response

```
{
  "barCode": "21299758700000020000001121100012100447561740",
  "amount": "20.00",
  "expirationDate": "2018-07-16"
}
```
