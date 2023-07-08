import { Knex } from 'knex';

import { ACCOUNT_ROLES_TABLE, ACCOUNT_TABLE, PROFILE_TABLE, PROFILE_TYPE_TABLE } from '../../configs/DBConfig';
import { PROFILE_TYPES } from '../../enums/ProfileTypes';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(PROFILE_TYPE_TABLE, table => {
    table.specificType('id', 'serial').notNullable();
    table.string('type', 15).notNullable();
    table.primary(['type']);

    table.timestamps(true, true);
  });

  await knex(PROFILE_TYPE_TABLE).insert([{ type: PROFILE_TYPES.BUSINESS }, { type: PROFILE_TYPES.PERSONAL }]);

  await knex.schema.alterTable(PROFILE_TABLE, table => {
    table.uuid('roles').notNullable();
    table.string('type').notNullable();

    table.foreign(['roles']).references(['id']).inTable(ACCOUNT_ROLES_TABLE);
    table.foreign(['type']).references(['type']).inTable(PROFILE_TYPE_TABLE);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.alterTable(ACCOUNT_TABLE, table => {
    table.dropColumn('roles');
  });
}
