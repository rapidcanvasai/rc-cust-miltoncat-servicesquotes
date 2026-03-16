import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import _ from "lodash";
import { DataAppResponse, ValidateTokenResponse } from "../types/api";
import parentBridge from "../utils/parentBridge";
import { getToken } from "../utils/helpers";

interface IError {
  msg: string;
}

class AxiosClient {
  token!: string;
  client!: AxiosInstance;
  baseURL!: string;

  init = async (): Promise<void> => {
    const hostname = await parentBridge.getHostName();
    this.baseURL = hostname
      ? `${hostname}/api`
      : `${window.location.origin}/api`;
    console.log("AxiosClient: Base URL set to:", this.baseURL);

    const token = await getToken();

    if (!token) {
      throw new Error("Token not found in localStorage");
    }

    // Create axios instance with dynamic baseURL
    const config = {
      baseURL: this.baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    this.client = axios.create(config);
    this.client.interceptors.request.use(
      this.requestInterceptor,
      this.rejectInterceptor
    );
    this.client.interceptors.response.use(
      this.responseInterceptor,
      this.rejectInterceptor
    );
    this.token = token;
  };

  responseInterceptor = (
    response: AxiosResponse<any, any>
  ): Promise<AxiosResponse<any, any>> | AxiosResponse<any, any> => {
    return response;
  };

  requestInterceptor = async (
    requestConfig: InternalAxiosRequestConfig<any>
  ): Promise<InternalAxiosRequestConfig<any>> => {
    if (_.isString(this.token)) {
      _.setWith(
        requestConfig,
        "headers.Authorization",
        `Bearer ${this.token}`,
        Object
      );
    }
    return requestConfig;
  };

  rejectInterceptor = ({
    response,
    message,
  }: AxiosError<IError>): Promise<never> => {
    if (response && response?.status > 500) {
      if (response?.data?.msg) {
        const modifiedResponse = {
          ...response,
          data: {
            ...response.data,
            msg: "Oops, something went wrong. Please try again.",
          },
        };
        return Promise.reject({ response: modifiedResponse, message });
      } else {
        const modifiedMessage = "Oops, something went wrong. Please try again.";
        return Promise.reject({ response, message: modifiedMessage });
      }
    }
    return Promise.reject({ response, message });
  };

  // DataApp API methods
  getDataAppsBySlug = async (
    slug: string
  ): Promise<{ data: DataAppResponse }> => {
    const response = await this.client.get<DataAppResponse>(
      `/dataapps/by-slug/${slug}`
    );
    return { data: response.data };
  };

  // Security API methods
  validateToken = async (body: {
    token: string;
  }): Promise<{ data: ValidateTokenResponse }> => {
    const response = await this.client.post<ValidateTokenResponse>(
      "/token/validation",
      body
    );
    return { data: response.data };
  };
}

export default AxiosClient;
