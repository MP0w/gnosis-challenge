import { useCallback, useState } from "react";
import { API_BASE_URL } from "./baseURL";

interface Profile {
  username: string;
  bio: string;
}

async function getProfile(): Promise<Profile> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get profile");
  }

  return response.json();
}

async function updateProfile(data: Partial<Profile>): Promise<Profile> {
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
    async (action: () => Promise<Profile>) => {
      setLoading(true);
      setError(undefined);
      try {
        const data = await action();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchProfile = useCallback(() => {
    executeProfileAction(getProfile);
  }, [executeProfileAction]);

  const saveProfile = useCallback(
    (data: Profile) => {
      executeProfileAction(() => updateProfile(data));
    },
    [executeProfileAction]
  );

  return { profile, loading, error, fetchProfile, saveProfile };
}
