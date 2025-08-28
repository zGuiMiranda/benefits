import * as dotenv from "dotenv";
import { Registry } from "../../src/config/di/DI";
import { BenefitRepository } from "../../src/outbound/repository/BenefitRepository";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
Registry.getInstance().provide(
  "benefitRepository",
  BenefitRepository.getInstance()
);
