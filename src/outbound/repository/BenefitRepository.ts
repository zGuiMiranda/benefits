import { Benefit } from "../../../src/core/domain/entity/Benefit";
import { IBenefitRepository } from "./IBenefitRepository";
import AbstractRepository from "./AbstractRepository";
import { BenefitModel } from "../../../src/core/model/BenefitModel";
import { Pageable, PageImpl, Page } from "../../../src/core/type/Page";
import { Order } from "sequelize"; // Correção no import

export class BenefitRepository
  extends AbstractRepository
  implements IBenefitRepository
{
  async activateDeactivate(benefit: Benefit): Promise<Benefit> {
    await BenefitModel.update(
      {
        isActive: benefit.IsActive,
      },
      {
        where: { id: benefit.Id },
      }
    );
    const updatedBenefit = await BenefitModel.findByPk(benefit.Id);
    return updatedBenefit ? this.toEntity(updatedBenefit, Benefit) : null;
    return {} as any;
  }

  async findAll(pageable: Pageable): Promise<Page<Benefit>> {
    const { page = 0, size = 10, sort = "id", direction = "ASC" } = pageable;
    const offset = page * size;
    const limit = size;
    const order: Order = [[sort, direction]];

    const result = await BenefitModel.findAndCountAll({
      offset,
      limit,
      order,
    });
    return new PageImpl(
      result.rows.map((b) => this.toEntity(b, Benefit)),
      pageable.page || 0,
      pageable.size || 10,
      result.count
    );
  }

  async save(benefit: Benefit): Promise<Benefit> {
    const benefitCreated = await BenefitModel.create({
      name: benefit.Name,
      description: benefit.Description,
      isActive: benefit.IsActive,
    });
    return this.toEntity(benefitCreated, Benefit);
  }

  async findById(id: number): Promise<Benefit | null> {
    const model = await BenefitModel.findByPk(id);
    if (!model) return null;
    return this.toEntity(model, Benefit);
  }

  async delete(id: number): Promise<void> {
    await BenefitModel.destroy({ where: { id } });
  }
}
