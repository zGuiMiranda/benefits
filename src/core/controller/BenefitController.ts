import { Response } from "express";
import { ListBenefit } from "../usecase/ListBenefit";
import { CreateBenefit } from "../usecase/CreateBenefit";
import { CreateBenefitDTO } from "src/inbound/dto/CreateBenefitDTO";
import { FastifyReply } from "fastify/types/reply";
import AbstractController from "./AbstractController";
import { PageParams } from "../../../src/BenefitRoutes.route";
import { ActivateDeactivateBenefit } from "../usecase/ActivateDeactivateBenefit";
import { DeleteBenefitUseCase } from "../usecase/DeleteBenefitUseCase";

export class BenefitController extends AbstractController {
  private createBenefitUseCase: CreateBenefit = new CreateBenefit();
  private listBenefitUseCase: ListBenefit = new ListBenefit();
  private activateDeactivateBenefit: ActivateDeactivateBenefit =
    new ActivateDeactivateBenefit();
  private deleteBenefitUseCase: DeleteBenefitUseCase =
    new DeleteBenefitUseCase();
  async getBenefits(params: PageParams, res: FastifyReply) {
    try {
      const page = this.parsePageable(params);
      const result = await this.listBenefitUseCase.execute(page);
      this.sendResponse(result, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async createBenefit(data: CreateBenefitDTO, res: FastifyReply) {
    try {
      const result = await this.createBenefitUseCase.execute({
        description: data.description,
        name: data.name,
      });
      this.sendResponse(result, res, this.STATUSES.CREATED);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteBenefit(id: number, res: Response) {
    try {
      const result = await this.deleteBenefitUseCase.execute(id);
      this.sendResponse(result, res, this.STATUSES.NO_CONTENT);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async activateBenefit(id: number, res: Response) {
    try {
      const result = await this.activateDeactivateBenefit.execute({
        id,
        isActive: true,
      });
      this.sendResponse(result, res, this.STATUSES.CREATED);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deactivateBenefit(id: number, res: Response) {
    try {
      const result = await this.activateDeactivateBenefit.execute({
        id,
        isActive: false,
      });
      this.sendResponse(result, res, this.STATUSES.CREATED);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
