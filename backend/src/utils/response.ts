export interface ApiResponse<T> {
  code: number
  message: string
  data?: T
}

export const successResponse = <T>(data: T, message: string = 'Success'): ApiResponse<T> => ({
  code: 0,
  message,
  data,
})

export const errorResponse = (message: string, code: number = 500): ApiResponse<any> => ({
  code,
  message,
})

export const unauthorizedResponse = (message: string = 'Unauthorized'): ApiResponse<any> => ({
  code: 401,
  message,
})

export const validationErrorResponse = (message: string = 'Validation Error'): ApiResponse<any> => ({
  code: 400,
  message,
})
