import { PageParams } from "../../../src/BenefitRoutes.route";
import { BusinessError } from "../error/BusinessError";
import { Pageable } from "../type/Page";

type HTTPSTATUSES = 200 | 201 | 400 | 500 | 204;

export default class AbstractController {
  protected STATUSES: { [key: string]: HTTPSTATUSES } = {
    INTERNAL_ERROR: 500,
    BUSINESS_ERROR: 400,
    SUCCESS_GET: 200,
    SUCCESS_POST: 201,
    CREATED: 201,
    NO_CONTENT: 204,
  };

  sendResponse(
    response,
    reply,
    status: HTTPSTATUSES = this.STATUSES.SUCCESS_GET
  ) {
    reply.status(status).send(response);
  }

  sendResponseCSV(
    response,
    reply,
    status: HTTPSTATUSES = this.STATUSES.SUCCESS_GET,
    fileName: string
  ) {
    reply.header("Content-Type", "text/csv");
    reply.header(
      "Content-Disposition",
      `attachment; filename="${fileName}.csv"`
    );
    reply.status(status).send(response);
  }

  handleError(error, reply) {
    if (error instanceof BusinessError)
      return reply
        .status(this.STATUSES.BUSINESS_ERROR)
        .send({ message: error.message, error });

    return reply
      .status(this.STATUSES.INTERNAL_ERROR)
      .send({ message: error.message, error });
  }

  parsePageable(params: PageParams): Pageable {
    const page = params.page ? parseInt(params.page as string) : 0;
    const size = params.size ? parseInt(params.size as string) : 10;
    const sort = params.sort as string | "id";
    const direction = (params.direction as "ASC" | "DESC") || "ASC";

    return {
      page: page !== undefined ? Math.max(0, page) : undefined,
      size: size !== undefined ? Math.min(100, Math.max(1, size)) : undefined,
      sort,
      direction,
    };
  }
}
