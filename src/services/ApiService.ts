import { AxiosRequestConfig, AxiosResponse } from "axios";
import { RestClient } from "./RestClient";

export class ApiService {
  static async get<T>(url: string, params = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await RestClient.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // static async post<T>(url: string, data: any): Promise<T> {
  //   try {
  //     const response: AxiosResponse<T> = await RestClient.post(url, data);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  static async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await RestClient.post(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      console.error(`Error in POST request to ${url}:`, error);
      throw error;
    }
  }
  static async put2<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await RestClient.put(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      console.error(`Error in POST request to ${url}:`, error);
      throw error;
    }
  }

  static async put<T>(url: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await RestClient.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  static async patch<T>(url: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await RestClient.patch(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // static async delete<T>(url: string, p0?: { params: { groupId: number; }; }): Promise<T> {
  //   try {
  //     const response: AxiosResponse<T> = await RestClient.delete(url);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await RestClient.delete(url, config);
      return response.data;
    } catch (error) {
      console.error(`Error en DELETE a ${url}:`, error);
      throw error;
    }
  }
  static async delete2<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        ...config,
        data,
      };

      const response: AxiosResponse<T> = await RestClient.delete(
        url,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error(`Error en DELETE a ${url}:`, error);
      throw error;
    }
  }
}
