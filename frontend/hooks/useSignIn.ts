import { useCallback, useState } from "react";
import { API_BASE_URL } from "./baseURL";
import { User } from "@/app/contexts/AuthContext";

async function signIn(message: string, signature: string) {
  const response = await fetch(`${API_BASE_URL}/sign-in`, {
    method: "POST",
    body: JSON.stringify({ message, signature }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to sign in");
  }

  return response.json();
}

export function useSignIn() {
  const [signedInUser, setSignedInUser] = useState<User | undefined>(undefined);

  const callback = useCallback(async (message: string, signature: string) => {
    signIn(message, signature)
      .then((user) => {
        setSignedInUser(user);
      })
      .catch(() => {
        setSignedInUser(undefined);
      });
  }, []);

  return { signIn: callback, signedInUser };
}
