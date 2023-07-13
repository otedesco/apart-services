export interface CustomError {
  status?: number;
  message?: string;
  code?: string;
  validationErrors?: any[];
  data?: any;
}
