import React, { useCallback, useEffect, useState } from "react";
import { useAuthContext, User } from "../contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

function ProfileContent({ user }: { user: User }) {
  const { profile, fetchProfile, saveProfile, loading, error } = useProfile();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const resetForm = useCallback(() => {
    setUsername(profile?.username ?? "");
    setBio(profile?.bio ?? "");
  }, [profile]);

  useEffect(() => {
    resetForm();
  }, [profile, resetForm]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (error) {
      alert("Failed to update profile. Please try again.");
    }
  }, [error]);

  const save = () => {
    if (username !== profile?.username || bio !== profile?.bio) {
      saveProfile({ username, bio });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <b>Logged in with address</b>
        <p>{user.address}</p>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={save}
              className="w-full px-3 py-2 border rounded-md text-black"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onBlur={save}
              className="w-full px-3 py-2 border rounded-md text-black"
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function Profile() {
  const { user } = useAuthContext();
  return <div>{user ? <ProfileContent user={user} /> : <></>}</div>;
}
