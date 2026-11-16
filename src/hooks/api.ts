import ResponseAssert from "@/models/interfaces/backend/ResponseAssert";
import { ApiService } from "@/services/ApiService";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export function useGet<T>(
  key: string | any[],
  url: string,
  params: Record<string, any> = {},
  enabled: boolean = true
) {
  return useQuery<ResponseAssert<T>>({
    queryKey: [key, params],
    queryFn: async () => {
      const query = new URLSearchParams(params).toString();
      const finalUrl = query ? `${url}?${query}` : url;
      return await ApiService.get<ResponseAssert<T>>(finalUrl);
    },
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGet2<T>(
  key: string | any[],
  url: string,
  params: Record<string, any> = {},
  enabled: boolean = true
) {
  return useQuery<ResponseAssert<T>>({
    queryKey: [key, params],
    queryFn: async () => {
      const query = new URLSearchParams(params).toString();
      const finalUrl = query ? `${url}?${query}` : url;
      return await ApiService.get<ResponseAssert<T>>(finalUrl);
    },
    enabled,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useGet3<T>(
  key: string | any[],
  url: string,
  params: Record<string, any> = {},
  options: Omit<
    UseQueryOptions<
      ResponseAssert<T>,
      Error,
      ResponseAssert<T>,
      readonly unknown[]
    >,
    "queryKey" | "queryFn"
  > = {}
) {
  const queryKey = Array.isArray(key) ? key : [key];
  return useQuery<ResponseAssert<T>>({
    queryKey,
    queryFn: async () => {
      const query = new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v != null)
      ).toString();
      const finalUrl = query ? `${url}?${query}` : url;
      return await ApiService.get<ResponseAssert<T>>(finalUrl);
    },
    enabled: true, // Por defecto true
    retry: false,
    staleTime: 0, // Por defecto como antes
    refetchOnWindowFocus: true,
    ...options, // ← Sobrescribe con las opciones que pases desde el componente
  });
}

// Hook para manejar peticiones POST, PUT, PATCH y DELETE
function useCustomMutation<T>(
  method: "post" | "put" | "patch" | "delete",
  url: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data?: any) => {
      return await ApiService[method]<ResponseAssert<T>>(url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      throw new Error(error);
    },
  });
}

export function useCustomMutation2<T>(
  method: "post" | "put" | "patch" | "delete",
  url: string,
  invalidateKey?: readonly unknown[] | undefined, // Nuevo parámetro
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data?: any) => {
      return await ApiService[method]<ResponseAssert<T>>(url, data);
    },
    onSuccess: () => {
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      }
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      throw new Error(error);
    },
  });
}

export function useCustomMutationByUrl<T>(
  method: "post" | "put" | "patch" | "delete",
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url, data }: { url: string; data?: any }) => {
      return await ApiService[method]<ResponseAssert<T>>(url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      throw new Error(error);
    },
  });
}

// Hook para hacer POST
// Hooks específicos
export function usePost2<T>(
  url: string,
  invalidateKey?: readonly unknown[],
  onSuccess?: () => void
) {
  return useCustomMutation2<T>("post", url, invalidateKey, onSuccess);
}

export function usePost<T>(url: string, onSuccess?: () => void) {
  return useCustomMutation<T>("post", url, onSuccess);
}

export function usePut<T>(url: string, onSuccess?: () => void) {
  return useCustomMutation<T>("put", url, onSuccess);
}

export function usePatch<T>(url: string, onSuccess?: () => void) {
  return useCustomMutation<T>("patch", url, onSuccess);
}

export function useDelete<T>(url: string, onSuccess?: () => void) {
  return useCustomMutation<T>("delete", url, onSuccess);
}

export function useDelete2<T>(
  url: string,
  invalidateKey?: readonly unknown[],
  onSuccess?: () => void
) {
  return useCustomMutation2<T>("delete", url, invalidateKey, onSuccess);
}
