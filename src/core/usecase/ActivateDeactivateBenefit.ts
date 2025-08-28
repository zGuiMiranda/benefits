import { IBenefitRepository } from "src/outbound/repository/IBenefitRepository";
import { Benefit } from "../domain/entity/Benefit";
import { inject } from "../../config/di/DI";
import { BusinessError } from "../error/BusinessError";
type ActivateDeactivateDTO = {
  id: number;
  isActive: boolean;
};
export class ActivateDeactivateBenefit {
  @inject("benefitRepository")
  private benefitRepository: IBenefitRepository;

  async execute(dto: ActivateDeactivateDTO): Promise<Benefit> {
    const benefit = await this.benefitRepository.findById(dto.id);

    if (!benefit) throw new BusinessError("Benefit not found");
    dto.isActive === false ? benefit.deactivate() : benefit.activate();
    return await this.benefitRepository.activateDeactivate(benefit);
  }
}
