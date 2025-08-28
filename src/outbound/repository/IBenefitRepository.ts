import { Benefit } from "src/core/domain/entity/Benefit";
import { Pageable, Page } from "src/core/type/Page";

export interface IBenefitRepository {
  findAll(page: Pageable): Promise<Page<Benefit>>;
  save(benefit: Benefit): Promise<Benefit>;
  findById(id: number): Promise<Benefit | null>;
  activateDeactivate(benefit: Benefit): Promise<Benefit>;
  delete(id: number): Promise<void>;
}
