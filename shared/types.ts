// This file is auto-generated. Do not edit it manually.


export enum Table {
  Users = "users",
}

export type Tables = {
  "users": Users,
};

export type Users = {
  id: string;
  address: string;
  email: string | null;
  name: string | null;
  created_at: Date;
  updated_at: Date;
};

