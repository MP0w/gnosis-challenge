import type { Knex } from "knex";

  const usersTable = "users";
  const profileTable = "profile";

  export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(usersTable, (table) => {
      table.uuid("id").primary();
      table.string("address").notNullable();
      table.timestamps(true, true);
    });

    await knex.schema.createTable(profileTable, (table) => {
      table
        .uuid("user_id")
        .primary()
        .references("id")
        .inTable(usersTable)
        .onDelete("CASCADE");
      table.string("username");
      table.string("bio");
      table.timestamps(true, true);
    });
  }

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(usersTable);
  await knex.schema.dropTable(profileTable);
}
