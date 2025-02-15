import { Knex } from "knex";
import { Profile, Table } from "../dbTypes";
import { UpdateProfileDto } from "../entities/profileDtos";

export class ProfileRepository {
  constructor(private readonly db: Knex) {}

  async getByUserId(userId: string): Promise<Profile | undefined> {
    return await this.db<Profile>(Table.Profile)
      .where({ user_id: userId })
      .first();
  }

  async createOrUpdateByUserId(
    userId: string,
    data: UpdateProfileDto
  ): Promise<Profile> {
    const [profile] = await this.db<Profile>(Table.Profile)
      .insert({
        user_id: userId,
        ...data,
        updated_at: this.db.fn.now(),
      })
      .onConflict("user_id")
      .merge()
      .returning("*");
    return profile;
  }
}
