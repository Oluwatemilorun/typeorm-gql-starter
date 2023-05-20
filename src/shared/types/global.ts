export interface ApolloContext {
  remoteAddress: string;
}

export interface PaginationOptions {
  limit: number;
  page: number;
}

export interface PaginationResult<D> {
  limit: number;
  page: number;
  totalPages: number;
  items: D[];
}
