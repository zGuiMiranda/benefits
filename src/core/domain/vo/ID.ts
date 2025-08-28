export default class ID {
  id: number;
  constructor(id: number) {
    this.id = id;
  }
  static create() {
    const id = Math.floor(Math.random() * 10000) + 1;
    return new ID(id);
  }

  getValue() {
    return this.id;
  }
}
