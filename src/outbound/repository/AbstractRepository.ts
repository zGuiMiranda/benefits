export default class AbstractRepository {
  private static instance: AbstractRepository | null = null;

  protected constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  toEntity<T>(Model: any, EntityClass: { new (...args: any[]): T }): T {
    return new EntityClass(...Object.values(Model.toJSON()));
  }
}
