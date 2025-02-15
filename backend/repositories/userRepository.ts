import { Knex } from "knex";
import { Users, Table } from "../dbTypes";

export class UserRepository {
  constructor(private readonly db: Knex) {}

  async getById(id: string): Promise<Users | undefined> {
    return await this.db<Users>(Table.Users).where({ id }).first();
  }

  async createOrUpdate(args: { id: string; address: string }): Promise<Users> {
    const [user] = await this.db<Users>(Table.Users)
      .insert({
        ...args,
        updated_at: this.db.fn.now(),
      })
      .onConflict("id")
      .merge()
      .returning("*");

    return user;
  }
}
