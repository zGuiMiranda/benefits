import { IBenefitRepository } from "src/outbound/repository/IBenefitRepository";
import { Benefit } from "../domain/entity/Benefit";
import { inject } from "../../config/di/DI";
type BenefitDTO = {
  name: string;
  description: string;
};
export class CreateBenefit {
  @inject("benefitRepository")
  private benefitRepository: IBenefitRepository;

  async execute(benefit: BenefitDTO): Promise<Benefit> {
    const benefitCreated = Benefit.create(benefit.name, benefit.description);
    const result = await this.benefitRepository.save(benefitCreated);
    return result;
  }
}
