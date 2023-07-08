import { Knex } from 'knex';

import { PROFILE_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(PROFILE_TABLE, table => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name', 45).notNullable();
    table.binary('last_name', 45);
    table.string('avatar_url');

    table.timestamps(true, true);

    table.primary(['id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(PROFILE_TABLE);
}
