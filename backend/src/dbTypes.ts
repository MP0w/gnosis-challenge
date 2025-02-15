// This file is auto-generated. Do not edit it manually.


export enum Table {
  Profile = "profile",
  Users = "users",
}

export type Tables = {
  "profile": Profile,
  "users": Users,
};

export type Profile = {
  user_id: string;
  username: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Users = {
  id: string;
  address: string;
  created_at: Date;
  updated_at: Date;
};

