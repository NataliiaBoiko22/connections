export interface HttpError {
  status: number;
  message: string;
  details?: string;
}

export interface RequestHeaders {
  headers: { [key: string]: string };
}
