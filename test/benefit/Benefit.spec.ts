import { Pageable } from "../../src/core/type/Page";
import { sequelize } from "../../src/config/database";
import { ListBenefit } from "../../src/core/usecase/ListBenefit";
import { CreateBenefit } from "src/core/usecase/CreateBenefit";
import { ActivateDeactivateBenefit } from "../../src/core/usecase/ActivateDeactivateBenefit";
import { DeleteBenefitUseCase } from "../../src/core/usecase/DeleteBenefitUseCase";
import { BusinessError } from "../../src/core/error/BusinessError";

describe("Benefit UseCases Integration Test (SQLite in-memory)", () => {
  let listBenefitUseCase: ListBenefit;
  let createBenefitUseCase: CreateBenefit;
  let activateDeactivateBenefitUseCase: ActivateDeactivateBenefit;
  let deleteBenefitUseCase: DeleteBenefitUseCase;

  beforeAll(async () => {
    await sequelize.sync();

    listBenefitUseCase = new ListBenefit();
    createBenefitUseCase = new CreateBenefit();
    activateDeactivateBenefitUseCase = new ActivateDeactivateBenefit();
    deleteBenefitUseCase = new DeleteBenefitUseCase();
  });

  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
  });

  it("should create a benefit with valid data", async () => {
    const payload = { name: "Novo Benefício", description: "Descrição" };

    const result = await createBenefitUseCase.execute(payload);

    expect(result.Name).toBe(payload.name);
    expect(result.Description).toBe(payload.description);
    expect(result.IsActive).toBe(true);
  });

  it("should throw error when creating benefit with invalid name", async () => {
    const payload = { name: "", description: "Descrição" };

    await expect(createBenefitUseCase.execute(payload)).rejects.toThrow(
      /name.*required|invalid/i
    );

    await expect(createBenefitUseCase.execute(payload)).rejects.toThrow(
      BusinessError
    );
  });

  it("should return a paginated list of benefits", async () => {
    for (let i = 1; i <= 12; i++) {
      await createBenefitUseCase.execute({
        name: `Beneficio ${i}`,
        description: `Desc ${i}`,
      });
    }

    const pageable: Pageable = {
      page: 1,
      size: 5,
      sort: "id",
      direction: "ASC",
    };
    const result = await listBenefitUseCase.execute(pageable);

    expect(result.content.length).toBe(5);
    expect(result.pageNumber).toBe(1);
    expect(result.pageSize).toBe(5);
    expect(result.totalElements).toBe(12);
    expect(result.totalPages).toBe(3);
    expect(result.first).toBe(false);
    expect(result.last).toBe(false);
  });

  it("should deactivate a benefit", async () => {
    const payload = { name: "Novo Benefício", description: "Descrição" };
    const result = await createBenefitUseCase.execute(payload);
    expect(result.IsActive).toBe(true);
    const afterDeactivation = await activateDeactivateBenefitUseCase.execute({
      id: result.Id,
      isActive: false,
    });
    expect(afterDeactivation.IsActive).toBe(false);
  });
  it("should activate a benefit", async () => {
    const payload = { name: "Novo Benefício", description: "Descrição" };
    const result = await createBenefitUseCase.execute(payload);
    expect(result.IsActive).toBe(true);
    const afterDeactivation = await activateDeactivateBenefitUseCase.execute({
      id: result.Id,
      isActive: false,
    });
    expect(afterDeactivation.IsActive).toBe(false);
    const afterActivation = await activateDeactivateBenefitUseCase.execute({
      id: result.Id,
      isActive: true,
    });
    expect(afterActivation.IsActive).toBe(true);
  });

  it("should throw error when deactivating a non-existent benefit", async () => {
    await expect(
      activateDeactivateBenefitUseCase.execute({ id: 999, isActive: false })
    ).rejects.toThrow(BusinessError);
  });

  it("should delete a benefit", async () => {
    const payload = { name: "Novo Benefício", description: "Descrição" };
    const result = await createBenefitUseCase.execute(payload);
    expect(result.Id).toBeDefined();
    await deleteBenefitUseCase.execute(result.Id);
    const pageable: Pageable = {
      page: 0,
      size: 5,
      sort: "id",
      direction: "ASC",
    };
    const listResult = await listBenefitUseCase.execute(pageable);
    expect(listResult.totalElements).toBe(0);
  });
});
