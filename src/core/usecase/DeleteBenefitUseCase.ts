import { IBenefitRepository } from "src/outbound/repository/IBenefitRepository";
import { inject } from "../../config/di/DI";
import { BusinessError } from "../error/BusinessError";
import { BUSINESS_ERRORS } from "../error/error";

export class DeleteBenefitUseCase {
  @inject("benefitRepository")
  private benefitRepository: IBenefitRepository;

  async execute(id: number): Promise<void> {
    const benefit = await this.benefitRepository.findById(id);

    if (!benefit) throw new BusinessError(BUSINESS_ERRORS.RESOURCE_NOT_FOUND);
    await this.benefitRepository.delete(id);
  }
}
