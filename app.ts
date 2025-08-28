import cors from "@fastify/cors";
import Fastify, { FastifyInstance } from "fastify";
import "reflect-metadata";
import { sequelize } from "./src/config/database";

import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { BenefitRepository } from "./src/outbound/repository/BenefitRepository";
import { BenefitRoutes } from "./src/BenefitRoutes.route";
import { Registry } from "./src/config/di/DI";

import {
  collectDefaultMetrics,
  Registry as PromRegistry,
  Counter,
} from "prom-client";

class App {
  public server: FastifyInstance;
  private promRegistry: PromRegistry;
  private requestCounter: Counter<string>;

  constructor() {
    this.promRegistry = new PromRegistry();
    this.collectMetrics();

    this.inject();
    this.server = Fastify({ logger: false });
    this.middleware();
    this.setSwagger();
    this.routes();
    this.prometheusRoute();
    this.initializeDatabase();
  }

  initializeDatabase() {
    sequelize.sync();
  }

  setSwagger() {
    this.server.register(swagger, {
      openapi: {
        info: {
          title: "Documentação Benefícios",
          description: "Documentação da API para Benefícios",
          version: "1.0.0",
        },
      },
    });
    this.server.register(swaggerUi, {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      staticCSP: true,
    });
  }

  routes() {
    this.server.register(BenefitRoutes, {
      prefix: "/benefits",
    });
  }

  middleware() {
    this.server.register(cors);

    this.server.addHook("onResponse", (request, reply, done) => {
      this.requestCounter.inc({
        method: request.method,
        route: request.url,
        status_code: reply.statusCode,
      });
      done();
    });

    this.server.addHook("onRequest", async (request) => {
      if (["POST"].includes(request.method)) {
        request.headers["content-type"] = "application/json";
      }
    });
  }

  inject() {
    Registry.getInstance().provide(
      "benefitRepository",
      BenefitRepository.getInstance()
    );
  }

  collectMetrics() {
    collectDefaultMetrics({ register: this.promRegistry });

    this.requestCounter = new Counter({
      name: "http_requests_total",
      help: "Total de requisições HTTP",
      labelNames: ["method", "route", "status_code"],
      registers: [this.promRegistry],
    });
  }

  prometheusRoute() {
    this.server.get("/metrics", async (request, reply) => {
      reply
        .header("Content-Type", this.promRegistry.contentType)
        .send(await this.promRegistry.metrics());
    });
  }
}

export default new App();
