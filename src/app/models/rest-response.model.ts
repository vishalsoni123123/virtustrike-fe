// This file defines the RestResponse interface used for API responses in the application.
export interface RestResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  pageNumber?: number;
  pageSize?: number;
  totalItems?: number;
  totalElements?: number;
  totalRecords?: number;
  error?: string;
}