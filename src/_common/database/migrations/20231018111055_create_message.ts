import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('message')))
    return knex.schema.createTable('message', table => {
      table.increments('id').primary();
      table.string('to').notNullable();
      table.string('from').notNullable();
      table.string('content').notNullable();
      table.enu('type', ['pending', 'success', 'failed']);
      table.integer('categoryId').notNullable();
      table.timestamp('resolvedAt').nullable();
      table.boolean('isPublished').notNullable();
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {}
