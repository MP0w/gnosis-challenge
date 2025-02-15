import { User } from "@/app/contexts/AuthContext";
import { useApiCall } from "./useApiCall";
import { useCallback } from "react";

export function useSignIn() {
  const { data, execute, loading, error } = useApiCall<User>(
    "POST",
    "/sign-in"
  );

  const signIn = useCallback(
    (message: string, signature: string) =>
      execute({
        body: JSON.stringify({ message, signature }),
      }),
    [execute]
  );

  return {
    signedInUser: data,
    signIn,
    loading,
    error,
  };
}
