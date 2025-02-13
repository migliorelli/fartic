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
    this.initSwagger();
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`
        =========================================
        💻 ENV = ${this.env} 
        🚀 App listening on the port ${this.port}
        =========================================
        `);
    });
  }

  public getServer() {
    return this.app;
  }

  private async initSocket() {
    this.socket = new SocketServer(this.server, {
      cors: {
        origin: ORIGIN,
        methods: ["GET", "POST"],
      },
    });
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

  private async disconnectDatabase() {
    await mongoose.disconnect();
  }
}

export default App;
