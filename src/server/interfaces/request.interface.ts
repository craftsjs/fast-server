export interface IRequest {
    method: string;
    request: Request;
    path: string;
    headers: { [key: string]: any };
    params?: { [key: string]: any };
    query?: { [key: string]: any };
    body?: { [key: string]: any } | string | undefined;
    formData: () => Promise<FormData>;
    originalUrl: string;
  }