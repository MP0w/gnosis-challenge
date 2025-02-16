import { useCallback, useState } from "react";
import { API_BASE_URL } from "./baseURL";
import { useUserCache } from "@/app/contexts/UserCacheContext";

export const useApiCall = <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  params?: RequestInit
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { resetUserCache } = useUserCache();
  const execute = useCallback<(additionalParams?: RequestInit) => Promise<T>>(
    async (additionalParams?: RequestInit) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
          ...params,
          ...additionalParams,
          method,
          headers: {
            "Content-Type": "application/json",
            ...params?.headers,
            ...additionalParams?.headers,
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            resetUserCache();
          }

          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setData(data);

        return data;
      } catch (err) {
        console.warn("API call error:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [method, params, path, resetUserCache]
  );

  return { data, loading, error, execute };
};
