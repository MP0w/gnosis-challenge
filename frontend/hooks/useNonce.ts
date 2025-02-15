import { useApiCall } from "./useApiCall";

export function useNonce() {
  return useApiCall<{ nonce: string }>("GET", "/nonce");
}
