export interface ApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface ApiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}
