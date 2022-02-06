require("dotenv").config({
  path: ".env",
});
const express = require("express");
const cors = require("cors");
const Routes = require("./Routes");

class Server {
  constructor() {
    this.express = express();

    this.middlewares();
    this.registerRoutes();

    this.executeServer();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  registerRoutes() {
    const router = new Routes().getRouter();
    this.express.use(router);
  }

  executeServer() {
    const port = process.env.PORT || 8080;
    this.express.listen(port);
    console.log(`Server running on port ${port}`);
  }
}

new Server();
