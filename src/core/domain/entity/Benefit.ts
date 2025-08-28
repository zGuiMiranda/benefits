import { BUSINESS_ERRORS } from "../../../../src/core/error/error";
import { BusinessError } from "../../error/BusinessError";
import ID from "../vo/ID";

export class Benefit {
  private id: number;
  private name: string;
  private description: string;
  private isActive: boolean;

  constructor(
    id: number,
    name: string,
    description: string,
    isActive: boolean = true
  ) {
    if (name.length < 2 || name.length > 100)
      throw new BusinessError(BUSINESS_ERRORS.INVALID_NAME);
    if (description.length > 255)
      throw new BusinessError(BUSINESS_ERRORS.INVALID_DESCRIPTION);

    this.id = id;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
  }

  static create(name: string, description: string): Benefit {
    const Id = ID.create().id;

    return new Benefit(Id, name, description, true);
  }

  get Id(): number {
    return this.id;
  }

  get Name(): string {
    return this.name;
  }

  get Description(): string {
    return this.description;
  }

  get IsActive(): boolean {
    return this.isActive;
  }

  activate(): void {
    this.isActive = true;
  }
  deactivate(): void {
    this.isActive = false;
  }
}
