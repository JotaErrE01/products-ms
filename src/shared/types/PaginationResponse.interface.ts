
export interface IPaginationResponse<T> {
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  data: T[];
}

