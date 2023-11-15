import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	if (!await knex.schema.hasTable('messages'))
		return knex.schema
			.createTable('messages', table => {
				table.increments('id').primary();
				table.string('to').notNullable();
				table.string('from').notNullable();
				table.string('content').notNullable();
				table.enu('type', ['pending', 'success', 'failed']);
				table.timestamp('resolvedAt').nullable();
				table.boolean('isPublished').notNullable();
				table.timestamps(true, true);
			});
}

export async function down(knex: Knex): Promise<void> { }