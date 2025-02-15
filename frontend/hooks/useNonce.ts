import { useCallback, useState } from "react";
import { API_BASE_URL } from "./baseURL";

async function getNonce() {
  const response = await fetch(`${API_BASE_URL}/nonce`, {
    credentials: "include",
  });
  const data = await response.json();
  return data.nonce;
}

export function useNonce() {
  const [nonce, setNonce] = useState<string | null>(null);

  const callback = useCallback(async () => {
    const nonce = await getNonce().catch(() => {
      setNonce(null);
    });
    setNonce(nonce);
  }, []);

  return { getNonce: callback, nonce };
}
