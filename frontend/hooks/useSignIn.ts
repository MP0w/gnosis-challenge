import { useCallback, useState } from "react";
import { API_BASE_URL } from "./baseURL";

async function signIn(message: string, signature: string) {
  const response = await fetch(`${API_BASE_URL}/sign-in`, {
    method: "POST",
    body: JSON.stringify({ message, signature }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to sign in");
  }

  return response.json();
}

export function useSignIn() {
  const [isSignedIn, setSignedIn] = useState<boolean | undefined>(undefined);

  const callback = useCallback(async (message: string, signature: string) => {
    signIn(message, signature)
      .then(() => {
        setSignedIn(true);
      })
      .catch(() => {
        setSignedIn(false);
      });
  }, []);

  return { signIn: callback, isSignedIn };
}
