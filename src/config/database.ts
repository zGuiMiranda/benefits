import { Sequelize } from "sequelize-typescript";
import { BenefitModel as Benefit } from "../../src/core/model/BenefitModel";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
  models: [Benefit],
});
