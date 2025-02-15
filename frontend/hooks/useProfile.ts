import { useCallback, useEffect, useState } from "react";
import { useApiCall } from "./useApiCall";

interface Profile {
  username: string;
  bio: string;
}

function useGetProfile() {
  return useApiCall<Profile>("GET", "/profile");
}

function useUpdateProfile() {
  const { data, execute, loading, error } = useApiCall<Profile>(
    "PUT",
    "/profile"
  );

  const updateProfile = useCallback(
    (data: Profile) =>
      execute({
        body: JSON.stringify(data),
      }),
    [execute]
  );

  return {
    updatedProfile: data,
    updateProfile,
    updateProfileLoading: loading,
    updateProfileError: error,
  };
}

export function useProfile() {
  const {
    data,
    loading: profileLoading,
    error: profileError,
    execute: getProfile,
  } = useGetProfile();
  const {
    updatedProfile,
    updateProfile,
    updateProfileLoading,
    updateProfileError,
  } = useUpdateProfile();

  const [loading, setLoading] = useState(
    profileLoading || updateProfileLoading
  );
  const [error, setError] = useState(profileError || updateProfileError);

  const [profile, setProfile] = useState(updatedProfile || data);

  useEffect(() => {
    setLoading(profileLoading || updateProfileLoading);
  }, [profileLoading, updateProfileLoading]);

  useEffect(() => {
    setError(updateProfileError || profileError);
  }, [profileError, updateProfileError]);

  useEffect(() => {
    setProfile(updatedProfile || data);
  }, [updatedProfile, data]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    getProfile,
  };
}
