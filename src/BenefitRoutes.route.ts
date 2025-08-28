import { FastifyInstance, FastifyRequest } from "fastify";
import { BenefitController } from "./core/controller/BenefitController";
import { CreateBenefitDTO } from "./inbound/dto/CreateBenefitDTO";

const benefitController = new BenefitController();
//a
export type PageParams = {
  page: string;
  size: string;
  sort: "id" | "name" | "description";
  direction: "asc" | "desc" | "ASC" | "DESC";
};

export async function BenefitRoutes(fastify: FastifyInstance) {
  fastify.post("", {
    schema: {
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            description: { type: "string" },
            isActive: { type: "boolean" },
          },
        },
      },
      body: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: CreateBenefitDTO }>,
      reply
    ) => {
      return benefitController.createBenefit(request.body, reply);
    },
  });

  fastify.get("", {
    schema: {
      querystring: {
        type: "object",
        properties: {
          page: { type: "string" },
          direction: { type: "string", enum: ["asc", "desc", "ASC", "DESC"] },
          size: { type: "string" },
          sort: { type: "string", enum: ["id", "name", "description"] },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            content: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  description: { type: "string" },
                  isActive: { type: "boolean" },
                },
                required: ["id", "name", "description", "isActive"],
              },
            },
            pageNumber: { type: "integer" },
            pageSize: { type: "integer" },
            totalElements: { type: "integer" },
            totalPages: { type: "integer" },
            first: { type: "boolean" },
            last: { type: "boolean" },
            empty: { type: "boolean" },
          },
          required: [
            "content",
            "pageNumber",
            "pageSize",
            "totalElements",
            "totalPages",
            "first",
            "last",
            "empty",
          ],
        },
      },
    },
    handler: async (
      request: FastifyRequest<{
        Querystring: PageParams;
      }>,
      reply
    ) => {
      return benefitController.getBenefits(request.query, reply);
    },
  });

  fastify.put("/:id/deactivate", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            description: { type: "string" },
            isActive: { type: "boolean" },
          },
          required: ["id", "name", "description", "isActive"],
        },
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply
    ) => {
      return benefitController.deactivateBenefit(request.params.id, reply);
    },
  });

  fastify.put("/:id/activate", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            description: { type: "string" },
            isActive: { type: "boolean" },
          },
          required: ["id", "name", "description", "isActive"],
        },
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply
    ) => {
      return benefitController.activateBenefit(request.params.id, reply);
    },
  });

  fastify.delete("/:id", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "number" },
        },
        required: ["id"],
      },
      response: {
        204: {},
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply
    ) => {
      return benefitController.deleteBenefit(request.params.id, reply);
    },
  });
}
