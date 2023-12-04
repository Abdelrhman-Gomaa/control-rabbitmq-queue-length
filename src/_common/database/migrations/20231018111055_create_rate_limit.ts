import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('ratelimit')))
    return knex.schema.createTable('ratelimit', table => {
      table.increments('id').primary();
      table.integer('windowsMs').notNullable();
      table.integer('max').notNullable();
      table.string('message').notNullable();
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {}
