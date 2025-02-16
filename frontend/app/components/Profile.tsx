import React, { useCallback, useEffect, useState } from "react";
import { useAuthContext, User } from "../contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { BioInput } from "./BioInput";

function ProfileContent({ user }: { user: User }) {
  const { profile, loading, error, getProfile, updateProfile } = useProfile();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [usernameError, setUsernameError] = useState<string | undefined>(
    undefined
  );
  const [bioError, setBioError] = useState<string | undefined>(undefined);

  const resetForm = useCallback(() => {
    setUsername(profile?.username ?? "");
    setBio(profile?.bio ?? "");
  }, [profile]);

  useEffect(() => {
    resetForm();
  }, [profile, resetForm]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (error) {
      alert("Failed to update profile. Please try again.");
    }
  }, [error]);

  const validateUsername = (value: string) => {
    if (
      value.length < 3 ||
      value.length > 30 ||
      !/^[a-zA-Z0-9_-]+$/.test(value)
    ) {
      return false;
    }

    return true;
  };

  const validateBio = (value: string) => {
    if (value.length > 255) {
      return false;
    }

    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(validateUsername(value) ? undefined : "Invalid username");
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBio(value);
    setBioError(validateBio(value) ? undefined : "Invalid bio");
  };

  const save = () => {
    const isValidUsername = validateUsername(username);
    const isValidBio = validateBio(bio);

    if (!isValidUsername || !isValidBio) {
      return;
    }

    if (username !== profile?.username || bio !== profile?.bio) {
      updateProfile({ username, bio });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <b>Signed in with address</b>
        <p>{user.address}</p>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && (
        <div className="space-y-4">
          <BioInput id="username" label="Username" error={usernameError}>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              onBlur={save}
              className={`w-full px-3 py-2 border rounded-md text-black ${
                usernameError ? "border-red-500" : ""
              }`}
              placeholder="Enter username"
            />
          </BioInput>

          <BioInput id="bio" label="Bio" error={bioError}>
            <textarea
              id="bio"
              value={bio}
              onChange={handleBioChange}
              onBlur={save}
              className={`w-full px-3 py-2 border rounded-md text-black ${
                bioError ? "border-red-500" : ""
              }`}
              rows={4}
              placeholder="Tell us about yourself"
            />
          </BioInput>
        </div>
      )}
    </div>
  );
}

export function Profile() {
  const { user } = useAuthContext();
  return <div>{user ? <ProfileContent user={user} /> : <></>}</div>;
}
