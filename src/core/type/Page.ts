export interface Page<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string;
  direction?: "ASC" | "DESC";
}

export class PageImpl<T> implements Page<T> {
  constructor(
    public content: T[],
    public pageNumber: number,
    public pageSize: number,
    public totalElements: number
  ) {}

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  get last(): boolean {
    return this.pageNumber >= this.totalPages - 1;
  }

  get first(): boolean {
    return this.pageNumber === 0;
  }

  get empty(): boolean {
    return this.content.length === 0;
  }

  static fromSequelize<T>(
    result: { rows: T[]; count: number },
    pageable: Pageable
  ): Page<T> {
    const { page, size } = pageable;
    return new PageImpl<T>(result.rows, page, size, result.count);
  }
}
