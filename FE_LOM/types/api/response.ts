export type ApiSuccessResponse<TData> = {
  success: true;
  status: number;
  message: string;
  data: TData;
  dataPage?: unknown;
  infoPage?: unknown;
};

export type ApiErrorResponse = {
  success: false;
  status: number;
  message: string;
  code?: string;
  errors?: unknown;
};

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
