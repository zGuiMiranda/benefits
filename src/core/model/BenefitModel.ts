import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "benefits", timestamps: true })
export class BenefitModel extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean;
}
