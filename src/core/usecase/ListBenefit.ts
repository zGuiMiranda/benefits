import { IBenefitRepository } from "../../../src/outbound/repository/IBenefitRepository";
import { Benefit } from "../domain/entity/Benefit";
import { inject } from "../../config/di/DI";
import { Page, Pageable } from "../type/Page";

export class ListBenefit {
  @inject("benefitRepository")
  private benefitRepository: IBenefitRepository;

  async execute(pageable: Pageable): Promise<Page<Benefit>> {
    return this.benefitRepository.findAll(pageable);
  }
}
