export type UpdateProfileDto = {
  username: string | null;
  bio: string | null;
};

export type ProfileDto = {
  userId: string;
  address: string;
  username: string | undefined;
  bio: string | undefined;
};
