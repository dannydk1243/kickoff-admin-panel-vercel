import Cookies from "js-cookie"

import type { AxiosError, AxiosResponse } from "axios"
import { ApiError, ApiResponse, ErrorResponse } from "@/types"

import API_AXIOS from "./apiHelper"

export const API = {
  // POST request
  post: async <T = any>(
    endpoint: string,
    data?: any,
    config?: any
  ): Promise<ApiResponse<T>> => {
    try {
      const accessToken = Cookies.get("accessToken")
      const response: AxiosResponse<T> = await API_AXIOS.post(endpoint, data, {
        ...config,
        headers: {
          Authorization: `Bearer ${accessToken || ""}`,
        },
        // headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      return {
        data: response.data,
        status: response.status,
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>

      const apiError: ApiError = {
        data: [],
        message: error?.response?.data?.details?.message || "Unknown error",
        error:
          error?.response?.data?.error ||
          error?.message ||
          "Something went wrong",
        status: error?.response?.status || 500,
      }

      throw apiError // TS now knows this never returns
    }
  },
}
