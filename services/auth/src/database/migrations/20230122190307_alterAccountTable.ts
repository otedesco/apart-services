import { Knex } from 'knex';

import { ACCOUNT_ROLES_TABLE, ACCOUNT_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  knex.schema.alterTable(ACCOUNT_TABLE, table => {
    table.text('roles').notNullable();
    table.foreign(['roles']).references(['id']).inTable(ACCOUNT_ROLES_TABLE);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.alterTable(ACCOUNT_TABLE, table => {
    table.dropColumn('roles');
  });
}
