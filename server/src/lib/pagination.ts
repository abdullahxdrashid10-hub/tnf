// server/src/lib/pagination.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shared offset pagination utility.
// ─────────────────────────────────────────────────────────────────────────────

export interface PaginationParams {
  page:  number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data:       T[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

/** Converts page/limit query params into Prisma skip/take */
export function toPrismaPagination(params: PaginationParams) {
  const page  = Math.max(1, params.page);
  const limit = Math.min(100, Math.max(1, params.limit)); // cap at 100 per page
  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  };
}

/** Wraps a data array with pagination metadata */
export function paginate<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResponse<T> {
  const { page, limit } = params;
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
