import { useCallback, useState } from "react";
import { API_BASE_URL } from "./baseURL";

interface Profile {
  username: string;
  bio: string;
}

async function getProfile() {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get profile");
  }

  return response.json();
}

async function updateProfile(data: Partial<Profile>) {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const executeProfileAction = useCallback(
    async <T>(action: () => Promise<T>) => {
      setLoading(true);
      setError(undefined);
      try {
        return await action();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchProfile = useCallback(async () => {
    const data = await executeProfileAction(getProfile);
    setProfile(data);
  }, [executeProfileAction]);

  const saveProfile = useCallback(
    async (data: Partial<Profile>) => {
      const updatedProfile = await executeProfileAction(() =>
        updateProfile(data)
      );
      setProfile(updatedProfile);
    },
    [executeProfileAction]
  );

  return { profile, loading, error, fetchProfile, saveProfile };
}
