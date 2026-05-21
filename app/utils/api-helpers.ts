
export function apiResponse(data: any, status: "success" | "error" = "success", message?: string) {
  return Response.json({
    status,
    message,
    data
  }, {
    status: status === "success" ? 200 : 500
  });
}

export function apiError(message: string, code: number = 500, error?: any) {
  return Response.json({
    status: "error",
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined
  }, {
    status: code
  });
}
