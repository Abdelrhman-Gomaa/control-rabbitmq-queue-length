import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('category')))
    return knex.schema.createTable('category', table => {
      table.increments('id').primary();
      table.string('enTitle').notNullable();
      table.string('arTitle').notNullable();
      table.string('enDescription').notNullable();
      table.string('arDescription').notNullable();
      table.boolean('isPublished').notNullable();
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {}
