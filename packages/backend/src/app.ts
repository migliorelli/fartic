import { NODE_ENV, ORIGIN, PORT, VERSION } from "@config";
import { DBMongoose } from "@databases";
import Routes from "@interfaces/routes.interface";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server as SocketServer } from "socket.io";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import SocketController from "./controllers/socket.controller";
import errorMiddleware from "./middlewares/error.middleware";

class App {
  public server = createServer();
  public app = express();
  public socket = new SocketServer();

  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.server = createServer(this.app);

    this.env = NODE_ENV || "development";
    this.port = PORT || 5174;

    this.initSocket();
    this.connectDatabase();
    this.initMiddlewares();
    this.initRoutes(routes);
    this.initErrorHandling();
    this.initSwagger();
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log("=========================================");
      console.log(`💻 ENV = ${this.env} `);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log("=========================================");
    });
  }

  public getServer() {
    return this.app;
  }

  private async initSocket() {
    this.socket = new SocketServer(this.server, {
      path: `/${VERSION}/socket.io`,
      cors: {
        origin: ORIGIN,
        methods: ["GET", "POST"],
      },
    });

    new SocketController(this.socket);
  }

  private async connectDatabase() {
    if (this.env !== "production") {
      mongoose.set("debug", true);
    }

    await mongoose.connect(DBMongoose.url, DBMongoose.options);
  }

  private initMiddlewares() {
    this.app.use(cors({ origin: ORIGIN }));
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(express.json());
  }

  private initRoutes(routes: Routes[]) {
    for (let route of routes) {
      this.app.use(`/${VERSION}/`, route.router);
    }
  }

  private initSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: "FARTIC REST API",
          version: "1.0.0",
          description: "Fartic API documentation",
        },
      },
      apis: ["swagger.yaml"],
    };

    const specs = swaggerJSDoc(options);
    this.app.use(`/${VERSION}/docs`, swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initErrorHandling() {
    this.app.use(errorMiddleware());
  }

  private async disconnectDatabase() {
    await mongoose.disconnect();
  }
}

export default App;
